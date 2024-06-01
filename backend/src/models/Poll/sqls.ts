import { SqlInjector } from "@/utils/orm";
import { knex } from "@/global/db";

export class PollSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  cands() {
    return knex.select(knex.raw(`
      COALESCE(ARRAY_TO_JSON(ARRAY_AGG(pc ORDER BY pc.rank ASC NULLS LAST)), '[]'::JSON)
      FROM poll_cands as pc
      WHERE pc.poll_id = ${this.table}.id
    `)).as("cands");

  }
}
