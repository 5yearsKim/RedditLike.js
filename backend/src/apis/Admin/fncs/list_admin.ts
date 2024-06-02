
import { adminM } from "@/models/Admin";
import { knex } from "@/global/db";
import type { ListAdminOptionT, AdminT } from "@/types";


export async function listAdmin(opt: ListAdminOptionT): Promise<ListData<AdminT>> {
  const table = adminM.table;
  const fetched = await adminM.find({
    builder: (qb, select) => {
      qb.orderBy("created_at", "desc");
      if (opt.$user) {
        qb.leftJoin("users", "users.id", "=", `${table}.user_id`);
        select.push(knex.raw("TO_JSON(users.*) AS user"));
      }
    }
  });


  return {
    data: fetched,
    nextCursor: null
  };
}