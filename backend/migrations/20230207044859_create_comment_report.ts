import { Knex } from "knex";

const table = "comment_reports";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("comment_id").notNullable().references("comments.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("user_id").references("users.id").onDelete("SET NULL").onUpdate("CASCADE");

    t.string("category", 32); // enum
    t.string("reason", 255);

    t.dateTime("ignored_at");
    t.dateTime("resolved_at");

    t.unique(["comment_id", "user_id"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}

