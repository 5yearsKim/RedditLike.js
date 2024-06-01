import { Knex } from "knex";

const table = "x_post_image";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("post_id").references("posts.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("image_id").references("images.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.integer("rank");

    t.unique(["post_id", "image_id"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}


