import { boardM, BoardSqls } from "@/models/Board";
import type { BoardT, ListBoardOptionT } from "@/types/Board";
import { encodeCursor, decodeCursor } from "@/utils/formatter";
import { knex } from "@/global/db";
import * as err from "@/errors";

export async function listBoard(opt: ListBoardOptionT = {}): Promise<ListData<BoardT>> {
  const table = boardM.table;
  const sqls = new BoardSqls(table);

  const limit = opt.limit || 30;
  let nextCursor: null|string = null;
  let getNextCursor: (item: BoardT, excepts: idT[]) => string|null = () => null;

  const fetched = await boardM.find({
    builder: (qb, select) => {

      qb.limit(limit);

      // sort
      switch (opt.sort || "follower") {
      case "follower":
        qb.orderByRaw("num_follower DESC, boards.created_at DESC");
        getNextCursor = (item, excepts): string => encodeCursor({
          num_follower: item.num_follower,
          created_at: item.created_at,
          excepts,
        });
        // process cursor
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where((qb_) => {
            qb_.whereRaw(`COALESCE(num_follower, 0) < ${cursor.num_follower}`)
              .orWhere(function(this: any) {
                if (cursor.created_at) {
                  this.whereRaw(`COALESCE(num_follower, 0) = ${cursor.num_follower}`).andWhere(`${table}.created_at`, "<", cursor.created_at);
                }
              });
          });

          // remove extepts
          qb.leftJoin(
            knex.select("id").from("boards").whereIn("id", cursor.excepts).as("not_b"),
            function (this: any) {
              this.on("not_b.id", "=", `${table}.id`);
            },
          );
          qb.whereNull("not_b.id");
        }
        break;
      case "hot":
        qb.orderByRaw("hot_score DESC NULLS LAST, boards.created_at DESC");
        getNextCursor = (item, excepts): string => encodeCursor({
          hot_score: item.hot_score,
          created_at: item.created_at,
          excepts,
        });
        // process cursor
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where((qb_) => {
            qb_.whereRaw(`COALESCE(hot_score, 0) < ${cursor.hot_score}`)
              .orWhere(function(this: any) {
                if (cursor.created_at) {
                  this.whereRaw(`COALESCE(hot_score, 0) = ${cursor.hot_score}`).andWhere(`${table}.created_at`, "<", cursor.created_at);
                }
              });
          });
          // remove extepts
          qb.leftJoin(
            knex.select("id").from("boards").whereIn("id", cursor.excepts).as("not_b"),
            function (this: any) {
              this.on("not_b.id", "=", `${table}.id`);
            },
          );
          qb.whereNull("not_b.id");
        }
        break;
      case "recent":
        qb.orderByRaw("created_at DESC");
        getNextCursor = (item): string => encodeCursor({
          created_at: item.created_at,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where(`${table}.created_at`, "<", cursor.created_at);
        }
        break;
      case "old":
        qb.orderByRaw("created_at ASC");
        getNextCursor = (item): string => encodeCursor({
          created_at: item.created_at,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where(`${table}.created_at`, ">", cursor.created_at);
        }
        break;
      case "recently_followed":
        // next cursor = null
        qb.orderByRaw("bf.created_at DESC NULLS LAST");
        getNextCursor = (): null => null;
        break;
      default:
        throw new err.InvalidActionE("invalid sort with:" + opt.sort);
      }

      if (opt.categoryId) {
        if (opt.categoryId == "except") {
          qb.leftJoin("x_board_category AS xbc", function(this) {
            this.on(`${table}.id`, "=", "xbc.board_id");
          });
          qb.whereNull("xbc.id");
        } else if (Array.isArray(opt.categoryId)) {
          qb.innerJoin("x_board_category AS xbc", function(this) {
            this.on(`${table}.id`, "=", "xbc.board_id").onIn("xbc.category_id", opt.categoryId as any);
          });
        } else {
          qb.innerJoin("x_board_category AS xbc", function(this) {
            this.on(`${table}.id`, "=", "xbc.board_id").on("xbc.category_id", "=", opt.categoryId as any);
          });
        }
      }

      // censor
      if (opt.censor) {
        switch (opt.censor) {
        case "trashed":
          qb.whereNotNull(`${table}.trashed_at`);
          break;
        case "exceptTrashed":
          qb.whereNull(`${table}.trashed_at`);
          break;
        default:
          throw new err.InvalidActionE("invalid censor with:" + opt.censor);
        }

      }

      // following
      if (opt.following && opt.userId) {
        switch (opt.following) {
        case "except":
          qb.leftJoin("board_followers AS bf", function(this) {
            this.on(`${table}.id`, "=", "bf.board_id").on("bf.user_id", "=", opt.userId as any);
          });
          qb.whereNull("bf.id");
          break;
        case "only":
          qb.innerJoin("board_followers AS bf", function(this) {
            this.on(`${table}.id`, "=", "bf.board_id").on("bf.user_id", "=", opt.userId as any);
          });
          break;
        default:
          throw new err.InvalidActionE("invalid following with:" + opt.following);
        }
      } else if (opt.sort == "recently_followed") {
        qb.leftJoin("board_followers AS bf", function(this) {
          this.on(`${table}.id`, "=", "bf.board_id").on("bf.user_id", "=", opt.userId as any);
        });
      }

      if (opt.block && opt.userId) {
        qb.leftJoin("board_blocks AS bb", function(this) {
          this.on(knex.raw(`${table}.id = bb.board_id AND bb.user_id = '${opt.userId}'`));
        });
        switch (opt.block) {
        case "except":
          qb.whereNull("bb.id");
          break;
        case "only":
          qb.whereNotNull("bb.id");
          break;
        default:
          throw new err.InvalidActionE("invalid block with:" + opt.block);
        }
      }


      // search
      if (opt.search) {
        qb.where((qb_) => {
          qb_.where(`${table}.name`, "ILIKE", `%${opt.search}%`)
            .orWhere(`${table}.description`, "ILIKE", `%${opt.search}%`);
        });
      }

      // managing
      if (opt.managing && opt.userId) {
        switch (opt.managing) {
        case "except":
          qb.leftJoin("board_managers AS bm", function(this) {
            this.on(`${table}.id`, "=", "bm.board_id").on("bm.user_id", "=", opt.userId as any);
          });
          qb.whereNull("bm.id");
          break;
        case "only":
          qb.innerJoin("board_managers AS bm", function(this) {
            this.on(`${table}.id`, "=", "bm.board_id").on("bm.user_id", "=", opt.userId as any);
          });
          break;
        default:
          throw new err.InvalidActionE("invalid managing with:" + opt.managing);
        }
      }

      // subqueries
      if (opt.$user_defaults && opt.userId) {
        select.push(...sqls.userDefaults(opt.userId));
      }
      if (opt.$posts) {
        select.push(sqls.posts());
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