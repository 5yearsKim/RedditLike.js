import type { PostT, ListPostOptionT } from "@/types/Post";
import { postM, PostSqls } from "@/models/Post";
import { decodeCursor, encodeCursor, edgeTimestamp } from "@/utils/formatter";
import { knex } from "@/global/db";
import * as err from "@/errors";


export async function listPost(opt: ListPostOptionT = {}): Promise<ListData<PostT>> {
  const table = postM.table;
  const sqls = new PostSqls(table);

  const limit = opt.limit || 30;
  let nextCursor: null|string = null;
  let getNextCursor: (item: PostT, excepts: idT[]) => null|string = () => null;

  const fetched = await postM.find({
    builder: (qb, select) => {

      qb.limit(limit);
      qb.whereNull(`${table}.deleted_at`);

      // join board by default
      qb.join("boards", "boards.id", "=", `${table}.board_id`);

      // published
      switch (opt.published ?? "only") {
      case "only":
        qb.whereNotNull(`${table}.published_at`);
        break;
      case "except":
        qb.whereNull(`${table}.published_at`);
        break;
      default:
        throw new err.InvalidFieldE("invalid published with:" + opt.published);
      }

      // sort
      switch (opt.sort ?? "recent") {
      case "recent":
        qb.orderByRaw(`${table}.created_at DESC`);
        getNextCursor = (item): string => encodeCursor({
          published_at: edgeTimestamp(item.published_at ?? new Date(), "floor"),
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where(`${table}.published_at`, "<", cursor.published_at);
        }
        break;
      case "hot":
        qb.orderByRaw(`${table}.hot_score DESC NULLS FIRST`); // null first for hot update
        getNextCursor = (item, excepts): string => encodeCursor({
          hot_score: item.hot_score,
          excepts,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where(`${table}.hot_score`, "<", cursor.hot_score);
          qb.leftJoin(
            knex.select("id").from("posts").whereIn("id", cursor.excepts).as("not_p"),
            function (this) {
              this.on("not_p.id", "=", `${table}.id`);
            },
          );
          qb.whereNull("not_p.id");
        }
        break;
      case "vote":
        qb.orderByRaw(`${table}.score DESC NULLS LAST, ${table}.published_at DESC NULLS LAST`);
        getNextCursor = (item, excepts): string => encodeCursor({
          score: item.score,
          published_at: item.published_at,
          excepts,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where((qb_) => {
            qb_.where(`${table}.score`, "<", cursor.score)
              .orWhere(function(this: any) {
                this.whereRaw(`COALESCE(${table}.score, 0) = ${cursor.score}`).andWhere(`${table}.published_at`, "<", cursor.published_at);
              });
          });
          qb.leftJoin(
            knex.select("id").from("posts").whereIn("id", cursor.excepts).as("not_p"),
            function (this) {
              this.on("not_p.id", "=", `${table}.id`);
            },
          );
          qb.whereNull("not_p.id");
        }
        break;
      case "discussed":
        qb.orderByRaw(`${table}.num_comment DESC NULLS LAST, ${table}.published_at DESC NULLS LAST`);
        getNextCursor = (item, excepts): string => encodeCursor({
          num_comment: item.num_comment ?? 0,
          published_at: item.published_at,
          excepts,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);

          qb.where((qb_) => {
            qb_.whereRaw(`COALESCE(${table}.num_comment, 0) < ${cursor.num_comment}`)
              .orWhere(function(this: any) {
                if (cursor.published_at) {
                  this.whereRaw(`COALESCE(${table}.num_comment, 0) = ${cursor.num_comment}`).andWhere(`${table}.published_at`, "<", cursor.published_at);
                }
              });
          });

          qb.leftJoin(
            knex.select("id").from("posts").whereIn("id", cursor.excepts).as("not_p"),
            function (this) {
              this.on("not_p.id", "=", `${table}.id`);
            },
          );
          qb.whereNull("not_p.id");
        }
        break;
      default:
        throw new err.InvalidFieldE("invalid sort with:" + opt.sort);
      }

      // boardId
      if (opt.boardId) {
        qb.where(`${table}.board_id`, opt.boardId);
      }

      // authorId
      if (opt.authorId) {
        qb.where(`${table}.author_id`, opt.authorId);
      }

      // search
      if (opt.search) {
        qb.where((qb_) => {
          qb_.where(`${table}.title`, "ILIKE", `%${opt.search}%`)
            .orWhere(`${table}.body`, "ILIKE", `%${opt.search}%`);
        });
      }


      // flagId
      if (opt.flagId) {
        qb.innerJoin("x_post_flag AS xpf", function (this) {
          this.on("xpf.flag_id", "=", opt.flagId as any)
            .andOn("xpf.post_id", "=", `${table}.id`);
        });
      }

      // pin
      if (opt.pin) {
        qb.leftJoin("post_pins AS pp", function (this) {
          this.on(knex.raw(`pp.post_id = ${table}.id AND pp.board_id = ${table}.board_id`));
        });
        switch (opt.pin) {
        case "only":
          qb.whereNotNull("pp.id");
          break;
        case "except":
          qb.whereNull("pp.id");
          break;
        default:
          throw new err.InvalidFieldE("invalid pin with:" + opt.pin);
        }
      }

      // report
      if (opt.report) {
        qb.with("distinct_reports", (qb) => {
          qb.distinctOn("post_id").select("*")
            .from({ pr: "post_reports" }).orderBy("post_id");
          if (opt.report == "unprocessed") {
            qb.whereNull("pr.ignored_at").whereNull("pr.resolved_at");
          }
          if (opt.report == "ignored") {
            qb.whereNotNull("pr.ignored_at");
          }
          if (opt.report == "resolved") {
            qb.whereNotNull("pr.resolved_at");
          }
        });

        qb.innerJoin("distinct_reports", function (this) {
          this.on(`${table}.id`, "=", "distinct_reports.post_id");
        });
      }

      // following
      if (opt.following && opt.userId) {
        switch (opt.following) {
        case "except":
          qb.leftJoin("board_followers AS bf", function (this) {
            this.on("bf.board_id", "=", `${table}.board_id`)
              .on("bf.user_id", "=", opt.userId as any);
          });
          qb.whereNull("bf.id");
          break;
        case "only":
          qb.innerJoin("board_followers AS bf", function (this) {
            this.on("bf.board_id", "=", `${table}.board_id`)
              .on("bf.user_id", "=", opt.userId as any);
          });
          break;
        default:
          throw new err.InvalidFieldE("invalid following with:" + opt.following);
        }
      }


      // block
      if (opt.block == "except" && opt.userId) {
        qb.leftJoin("board_blocks AS bb", function (this) {
          this.on("bb.board_id", "=", `${table}.board_id`)
            .on("bb.user_id", "=", opt.userId as any);
        });
        qb.whereNull("bb.id");
      }


      // bookmark
      if (opt.bookmark == "only" && opt.userId) {
        qb.innerJoin("post_bookmarks AS pb", function (this) {
          this.on("pb.post_id", "=", `${table}.id`)
            .on("pb.user_id", "=", opt.userId as any);
        });
      }

      // fromAt
      if (opt.fromAt) {
        qb.where(`${table}.published_at`, ">", opt.fromAt);
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
          throw new err.InvalidFieldE("invalid censor with:" + opt.censor);
        }
      }

      // boardCensor
      switch (opt.boardCensor ?? "exceptTrashed") {
      case "trashed":
        qb.whereNotNull("boards.trashed_at");
        break;
      case "all":
        // do nothing
        break;
      case "exceptTrashed":
        qb.whereNull("boards.trashed_at");
        break;
      }

      // subqueries
      if (opt.$defaults) {
        select.push(...sqls.defaults());
      }
      if (opt.$user_defaults && opt.userId) {
        select.push(...sqls.userDefaults(opt.userId));
      }
      if (opt.$manager_defaults) {
        select.push(...sqls.managerDefaults());
      }
      if (opt.$board) {
        // select.push(sqls.board());
        select.push(knex.raw("TO_JSON(boards.*) AS board"));
      }
    }
  });
  if (fetched.length >= limit) {
    const lastItem = fetched[fetched.length - 1];
    const exceptIds = fetched.map((item) => item.id);
    nextCursor = getNextCursor(lastItem, exceptIds);
  }

  return {
    data: fetched,
    nextCursor,
  };
}