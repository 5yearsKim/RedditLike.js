import { Knex } from "knex";

const table = "images";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.text("host");
    t.text("path").notNullable();
    t.string("mime_type", 32);
    t.integer("width").unsigned();
    t.integer("height").unsigned();

    t.unique(["host", "path"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}


