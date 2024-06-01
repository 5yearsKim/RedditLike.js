import { Knex } from "knex";

const table = "categories";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("group_id").notNullable().references("groups.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.string("label", 32).notNullable();
    t.integer("parent_id").references(`${table}.id`).onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("rank");

    t.unique(["group_id", "label"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}