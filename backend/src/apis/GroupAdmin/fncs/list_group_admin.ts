
import { groupAdminM } from "@/models/GroupAdmin";
import { knex } from "@/global/db";
import * as err from "@/errors";
import type { ListGroupAdminOptionT, GroupAdminT } from "@/types";


export async function listGroupAdmin(opt: ListGroupAdminOptionT): Promise<ListData<GroupAdminT>> {
  const table = groupAdminM.table;
  if (!opt.groupId) {
    throw new err.InvalidDataE("groupId is required");
  }
  const fetched = await groupAdminM.find({
    builder: (qb, select) => {
      qb.orderBy("created_at", "desc");
      qb.whereRaw(`${table}.group_id = ${opt.groupId}`);
      if (opt.$user) {
        qb.leftJoin("users", "users.id", "=", `${table}.user_id`);
        select.push(knex.raw("TO_JSON(users.*) AS user"));
      }
      if (opt.$account && opt.$user) {
        select.push(knex.raw("TO_JSON(accounts.*) AS account"));
        qb.leftJoin("accounts", "accounts.id", "=", "users.account_id");
      }
    }
  });


  return {
    data: fetched,
    nextCursor: null
  };
}