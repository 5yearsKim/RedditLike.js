import { Knex } from "knex";

const table = "board_user_blocks";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").references("boards.id").notNullable().onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("from_id").references("users.id").notNullable().onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("target_id").references("users.id").notNullable().onUpdate("CASCADE").onDelete("CASCADE");

    t.unique(["board_id", "from_id", "target_id"]);
    t.index(["board_id", "target_id"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}