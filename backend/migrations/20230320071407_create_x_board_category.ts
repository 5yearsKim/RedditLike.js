import { Knex } from "knex";

const table = "x_board_category";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("category_id").references("categories.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("board_id").references("boards.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.unique(["category_id", "board_id"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}