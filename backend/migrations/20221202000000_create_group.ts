import { Knex } from "knex";

const table = "groups";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function (t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.string("key").notNullable();
    t.string("name").notNullable();
    t.string("short_name");
    t.string("avatar_path");
    t.string("description");
    t.enu("protection", ["public", "protected", "private"]);
    t.string("theme_color");
    t.boolean("use_point").defaultTo(false);
    t.boolean("allow_create_board").defaultTo(true);
    t.string("locale");

    t.dateTime("deleted_at");

    t.unique(["key"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}

