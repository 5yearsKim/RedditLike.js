import { Knex } from "knex";

const table = "notifications";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("user_id").notNullable().references("users.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("board_id").references("boards.id").onDelete("CASCADE").onUpdate("CASCADE"); // nullable
    t.string("type", 32); // enum added on constraint
    t.text("message").notNullable();
    t.json("arg");

    t.boolean("is_checked").notNullable().defaultTo(false);

    t.index("user_id");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}

