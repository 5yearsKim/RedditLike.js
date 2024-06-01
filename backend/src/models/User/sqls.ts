import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder } from "@/global/db";


export class UserSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  account(): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(acc.*)"))
      .from({ acc: "boards" })
      .whereRaw(`acc.id = ${this.table}.account_id`)
      .as("account");
  }
}
