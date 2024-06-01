import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder } from "@/global/db";

export class PollCandSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  numVote(): QueryBuilder {
    return knex.select(knex.raw("COALESCE(COUNT(*), 0)::integer"))
      .from({ pv: "poll_votes" })
      .whereRaw(`pv.cand_id = ${this.table}.id`)
      .as("num_vote");
  }

  myVote(userId: idT): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(pv.*)::json"))
      .from({ pv: "poll_votes" })
      .whereRaw(`pv.cand_id = ${this.table}.id AND pv.user_id = ${userId}`)
      .as("my_vote");
  }
}
