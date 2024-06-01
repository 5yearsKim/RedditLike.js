import { Knex } from "knex";

const table = "polls";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("author_id").notNullable().references("users.id").onUpdate("CASCADE");
    t.string("title", 255);
    t.text("description");

    t.boolean("allow_multiple").defaultTo(false);
    t.dateTime("expires_at");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}