import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder, type Raw } from "@/global/db";


export class BoardUserBlockSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  board(): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(b.*)"))
      .from({ b: "boards" })
      .whereRaw(`b.id = ${this.table}.board_id`)
      .as("board");
  }

  target(): Raw {
    return knex.raw(`get_author(${this.table}.target_id, ${this.table}.board_id) AS target`);
  }
}
