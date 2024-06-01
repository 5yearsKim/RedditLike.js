import { Knex } from "knex";

const table = "board_muters";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").notNullable().references("boards.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("user_id").notNullable().references("users.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.dateTime("until");
    t.string("reason", 255);

    t.unique(["board_id", "user_id"]);
    t.index("user_id");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}

