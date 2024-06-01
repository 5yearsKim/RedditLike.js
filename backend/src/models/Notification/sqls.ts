import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder } from "@/global/db";

export class NotificationSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  board(): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(b.*)"))
      .from({ b: "boards" })
      .whereRaw(`b.id = ${this.table}.board_id`)
      .as("board");
  }
}
