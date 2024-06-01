import { Knex } from "knex";

const table = "group_invitations";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("group_id").references("groups.id").onUpdate("CASCADE").onDelete("CASCADE").notNullable();
    t.string("email").notNullable();
    t.dateTime("declined_at");

    t.unique(["group_id", "email"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}