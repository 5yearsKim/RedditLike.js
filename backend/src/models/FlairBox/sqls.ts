import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder } from "@/global/db";

export class FlairBoxSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  flairs(): QueryBuilder {
    return knex.select(knex.raw("COALESCE(ARRAY_TO_JSON(ARRAY_AGG(flairs ORDER BY flairs.rank ASC NULLS LAST)), '[]'::JSON)"))
      .from("flairs")
      .whereRaw("flair_boxes.id = flairs.box_id AND flairs.creator_id IS NULL")
      .as("flairs");
  }

  customFlairs(userId: idT): QueryBuilder {
    return knex.select(
      knex.raw("COALESCE(ARRAY_TO_JSON(ARRAY_AGG(my_flairs)), '[]'::JSON)"),
    )
      .from({ my_flairs: "flairs" })
      .whereRaw(`my_flairs.creator_id = '${userId}' AND my_flairs.box_id = ${this.table}.id`)
      .as("custom_flairs");
  }
}
