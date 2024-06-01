import { userM } from "@/models/User";
import * as err from "@/errors";
import { knex } from "@/global/db";
import { encodeCursor, decodeCursor } from "@/utils/formatter";
import { UserT, ListUserOptionT } from "@/types";

export async function listUser(opt: ListUserOptionT): Promise<ListData<UserT>> {
  const table = userM.table;
  const limit = opt.limit ?? 30;
  let nextCursor: string|null = null;
  let getNextCursor: (item: UserT)=> string|null = () => null;

  if (!opt.groupId) {
    throw new err.InvalidDataE("groupId should be given to fetch users");
  }

  const fetched = await userM.find({
    builder: (qb, select) => {
      qb.limit(limit);
      // lookup account by default
      qb.leftJoin("accounts", `${table}.account_id`, "=", "accounts.id");
      select.push(knex.raw("TO_JSON(accounts.*) AS account"));

      qb.whereNull(`${table}.deleted_at`);

      // groupId
      qb.whereRaw(`${table}.group_id = ${opt.groupId}`);

      // sort
      switch (opt.sort ?? "recent") {
      case "recent":
        qb.orderByRaw(`${table}.created_at DESC`);
        getNextCursor = (item) => encodeCursor({
          created_at: item.created_at,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where(`${table}.created_at`, "<", cursor.created_at);
        }
        break;
      case "old":
        qb.orderByRaw(`${table}.created_at ASC`);
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where(`${table}.created_at`, ">", cursor.created_at);
        }
        break;
      default:
        throw new err.InvalidDataE("invalid sort option: " + opt.sort);
      }

      // search
      if (opt.search) {
        qb.where("accounts.email", "like", `%${opt.search}%`);
      }
    }
  });

  if (fetched.length >= limit) {
    const lastItem = fetched[fetched.length - 1];
    nextCursor = getNextCursor(lastItem);
  }

  return { data: fetched, nextCursor };
}