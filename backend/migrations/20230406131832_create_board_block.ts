import { Knex } from "knex";

const table = "board_blocks";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").references("boards.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("user_id").references("users.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.unique(["user_id", "board_id"]);
    t.index("board_id");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}