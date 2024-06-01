import { Knex } from "knex";

const table = "x_post_flag";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("flag_id").notNullable().references("flags.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("post_id").notNullable().references("posts.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.integer("rank"); // just in case.. no need

    t.unique(["post_id", "flag_id"]);
    t.index("flag_id");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}

