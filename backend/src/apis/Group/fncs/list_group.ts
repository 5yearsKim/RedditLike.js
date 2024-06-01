import { groupM } from "@/models/Group";
import { encodeCursor, decodeCursor } from "@/utils/formatter";
import * as err from "@/errors";
import { lookupBuilder } from "./lookup_builder";
import type { GroupT, ListGroupOptionT } from "@/types/Group";

export async function listGroup(opt: ListGroupOptionT): Promise<ListData<GroupT>> {
  const table = groupM.table;
  const limit = opt.limit || 30;
  let nextCursor: null|string = null;
  let getNextCursor: (item: GroupT) => string|null = () => null;

  const fetched = await groupM.find({
    builder: (qb, select) => {
      qb.limit(limit);

      // sort
      switch (opt.sort || "recent") {
      case "recent":
        qb.orderByRaw(`${table}.created_at DESC`);
        getNextCursor = (item) => encodeCursor({
          created_at: item.created_at,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where("created_at", "<", cursor.created_at);
        }
        break;
      case "old":
        qb.orderBy(`${table}.created_at ASC`);
        getNextCursor = (item) => encodeCursor({
          created_at: item.created_at,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where("created_at", ">", cursor.created_at);
        }
        break;
      default:
        throw new err.InvalidDataE("invalid sort option");
      }

      // join
      if (opt.joined && opt.accountId) {
        switch (opt.joined) {
        case "only":
          qb.innerJoin("users AS u", function (this) {
            this.on("u.account_id", "=", opt.accountId as any)
              .onNull("u.deleted_at")
              .andOn("u.group_id", "=", `${table}.id`);
          });
          break;
        case "except":
          qb.leftJoin("users AS u", function (this) {
            this.on("u.account_id", "=", opt.accountId as any)
              .onNull("u.deleted_at")
              .andOn("u.group_id", "=", `${table}.id`);
          });
          qb.whereNull("u.id");
          break;
        }
      }

      if (opt.admining && opt.accountId) {
        // join user first
        qb.innerJoin("users AS u", function (this) {
          this.on("u.account_id", "=", opt.accountId as any)
            .onNull("u.deleted_at")
            .andOn("u.group_id", "=", `${table}.id`);
        });
        qb.leftJoin("group_admins AS ga", function (this) {
          this.on("ga.user_id", "=", "u.id")
            .andOn("ga.group_id", "=", `${table}.id`);
        });

        switch (opt.admining) {
        case "except":
          qb.whereNull("ga.id");
          break;
        case "only":
          qb.whereNotNull("ga.id");
          break;
        default:
          throw new err.InvalidDataE("invalid admining option" + opt.admining);
        }
      }

      // lookup builder
      lookupBuilder(select, opt);

    }
  });

  if (fetched.length >= limit) {
    const last = fetched[fetched.length - 1];
    nextCursor = getNextCursor(last);
  }

  return {
    data: fetched,
    nextCursor
  };
}