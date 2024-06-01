import { SqlInjector } from "@/utils/orm";
import { knex, type Raw } from "@/global/db";

export class PostManagingLogSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  author(): Raw {
    return knex.raw(`get_author(${this.table}.user_id, ${this.table}.board_id) as author`);
  }
}
