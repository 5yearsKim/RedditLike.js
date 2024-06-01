import { Knex } from "knex";

const table = "post_bookmarks";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("post_id").references("posts.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("user_id").references("users.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.unique(["post_id", "user_id"]);
    t.index("user_id");
  });

}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}