import { commentM, CommentSqls } from "@/models/Comment";
import { edgeTimestamp, encodeCursor, decodeCursor } from "@/utils/formatter";
import type { CommentT, ListCommentOptionT } from "@/types/Comment";
import { knex } from "@/global/db";
import * as err from "@/errors";

export async function listComment(opt: ListCommentOptionT): Promise<ListData<CommentT>> {
  const table = commentM.table;

  const sqls = new CommentSqls(table);
  const limit = opt.limit || 30;

  let nextCursor: null|string = null;
  let getNextCursor: (item: CommentT) => string|null = () => null;

  const fetched = await commentM.find({
    builder: (qb, select) => {
      // sort
      switch (opt.sort ?? "old") {
      case "old":
        qb.orderByRaw(`${table}.created_at ASC`);
        getNextCursor = (item): string => encodeCursor({
          created_at: edgeTimestamp(item.created_at, "ceil"),
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where(`${table}.created_at`, ">", cursor.created_at);
        }
        break;
      case "recent":
        qb.orderByRaw(`${table}.created_at DESC`);
        getNextCursor = (item): string => encodeCursor({
          created_at: edgeTimestamp(item.created_at, "floor"),
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where(`${table}.created_at`, "<", cursor.created_at);
        }
        break;
      case "vote":
        qb.orderByRaw(`${table}.score DESC NULLS LAST, ${table}.created_at ASC`);
        getNextCursor = (item): string => encodeCursor({
          created_at: edgeTimestamp(item.created_at, "ceil"),
          score: item.score,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where((qb_) => {
            qb_.whereRaw(`COALESCE(${table}.score, 0) < ${cursor.score}`)
              .orWhere(function(this: any) {
                this.whereRaw(`COALESCE(${table}.score, 0) = ${cursor.score}`).where(`${table}.created_at`, ">", cursor.created_at);
              });
          });
        }
        break;
      case "discussed":
        qb.orderByRaw(`${table}.num_children DESC NULLS LAST, ${table}.created_at ASC`);
        getNextCursor = (item): string => encodeCursor({
          created_at: edgeTimestamp(item.created_at, "ceil"),
          num_children: item.num_children,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where((qb_) => {
            qb_.whereRaw(`COALESCE(${table}.num_children, 0) < ${cursor.num_children}`)
              .orWhere(function(this: any) {
                this.whereRaw(`COALESCE(${table}.num_children, 0) = ${cursor.num_children}`).where(`${table}.created_at`, ">", cursor.created_at);
              });
          });
        }
        break;
      default:
        throw new err.InvalidDataE("invalid sort: " + opt.sort);
      }
      // post
      if (opt.postId) {
        qb.where(`${table}.post_id`, opt.postId);
      }

      // author
      if (opt.authorId) {
        qb.where(`${table}.author_id`, opt.authorId);
      }

      // report
      if (opt.report) {
        qb.leftJoin("comment_reports AS cr", `${table}.id`, "cr.comment_id");
        switch (opt.report) {
        case "all":
          break;
        case "unprocessed":
          qb.whereNull("cr.ignored_at").whereNull("cr.resolved_at");
          break;
        case "ignored":
          qb.whereNotNull("cr.ignored_at");
          break;
        case "resolved":
          qb.whereNotNull("cr.resolved_at");
          break;
        default:
          throw new err.InvalidDataE("invalid report: " + opt.report);
        }
      }

      // censor
      if (opt.censor) {
        switch (opt.censor) {
        case "approved":
          qb.whereNotNull(`${table}.approved_at`);
          break;
        case "trashed":
          qb.whereNotNull(`${table}.trashed_at`);
          break;
        case "exceptTrashed":
          qb.whereNull(`${table}.trashed_at`);
          break;
        case "exceptProcessed":
          qb.whereNull(`${table}.trashed_at`).whereNull(`${table}.approved_at`);
          break;
        default:
          throw new err.InvalidDataE("invalid censor: " + opt.censor);
        }
      }

      // defaults subqueries
      if (opt.$defaults) {
        select.push(...sqls.defaults());
      }

      // users subqueries
      if (opt.$user_defaults && opt.userId) {
        select.push(...sqls.userDefaults(opt.userId));
      }

      // managers subqueries
      if (opt.$manager_defaults) {
        select.push(...sqls.managerDefaults());
      }

      // boardId
      if (opt.boardId && opt.$post) {
        qb.where("posts.board_id", opt.boardId);
      }

      // rootPath
      if (opt.rootPath === null) {
        qb.whereNull(`${table}.parent_id`);
      } else if (opt.rootPath) {
        qb.whereNotNull(`${table}.path`).whereRaw(`TEXT2LTREE('${opt.rootPath}'::text) @> ${table}.path`);
      }

      // lookup post
      if (opt.$post) {
        // select.push(sqls.post());
        // join insead of subquery
        select.push(knex.raw("TO_JSON(posts.*) AS post"));
        qb.leftJoin("posts", `${table}.post_id`, "posts.id");
      }

      // parent
      if (opt.$parent) {
        select.push(knex.raw("TO_JSON(parent_comments.*) AS parent"));
        qb.leftJoin(`${table} AS parent_comments`, `${table}.parent_id`, "parent_comments.id");
      }

      // lookup author_idx
      if (opt.$author_idx) {
        select.push("ai.idx AS author_idx");
        qb.leftJoin("post_comment_author_idx AS ai", function(this: any) {
          this.on("ai.author_id", "=", `${table}.author_id`)
            .on("ai.post_id", "=", `${table}.post_id`);
        });
      }
    }
  });

  if (fetched.length >= limit) {
    const lastItem = fetched[fetched.length - 1];
    nextCursor = getNextCursor(lastItem);
  }

  return {
    data: fetched,
    nextCursor,
  };
}


