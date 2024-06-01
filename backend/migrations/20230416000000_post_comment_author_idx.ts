import { Knex } from "knex";

const table = "post_comment_author_idx";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.integer("post_id").notNullable().references("posts.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("author_id").notNullable().references("users.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.integer("idx").unsigned().notNullable();
    t.primary(["post_id", "author_id"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}


