import { Knex } from "knex";

const table = "flags";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").notNullable().references("boards.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.string("label", 32).notNullable();
    t.string("text_color", 7);
    t.string("bg_color", 7);

    t.text("description");
    t.boolean("manager_only").notNullable().defaultTo(false);

    t.check("text_color ~* '^#[a-f0-9]{2}[a-f0-9]{2}[a-f0-9]{2}$'");
    t.check("bg_color ~* '^#[a-f0-9]{2}[a-f0-9]{2}[a-f0-9]{2}$'");
    t.index("board_id");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}