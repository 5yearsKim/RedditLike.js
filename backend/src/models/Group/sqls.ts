import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder } from "@/global/db";

export class GroupSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  admin(accountId: idT): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(ga)"))
      .from("group_admins AS ga")
      .leftJoin("users AS u", "u.id", "ga.user_id")
      .whereNull("u.deleted_at")
      .whereRaw(`u.account_id = ${accountId} AND ga.group_id = ${this.table}.id`)
      .as("admin");
  }
}
