import { Knex } from "knex";

const table = "accounts";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function (t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    // real field
    t.string("sub", 255).notNullable().unique();
    t.string("email", 255).unique();
    t.dateTime("deleted_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}

