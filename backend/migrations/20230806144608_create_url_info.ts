import { Knex } from "knex";

const table = "url_infos";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.text("url").notNullable();
    t.text("title");
    t.text("description");
    t.text("image");
    t.text("sitename");
    t.text("hostname");

    t.unique(["url"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}