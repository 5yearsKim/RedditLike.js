import { Knex } from "knex";

const table = "poll_votes";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("user_id").notNullable().references("users.id").onUpdate("CASCADE");
    t.integer("cand_id").notNullable().references("poll_cands.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.unique(["user_id", "cand_id"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}
