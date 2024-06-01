import { Knex } from "knex";

const table = "email_verifications";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.string("email").notNullable();
    t.boolean("is_verified").defaultTo(false);
    t.string("code").notNullable();
    t.integer("trial").defaultTo(0);

    t.index(["email"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}