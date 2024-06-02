import { Knex } from "knex";


const table = "boards";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.string("name", 32).notNullable();
    t.text("description");
    t.text("avatar_path");
    t.text("bg_path");

    t.dateTime("trashed_at");
    t.string("trashed_by");

    t.boolean("use_theme").notNullable().defaultTo(false);
    t.string("theme_color", 7);

    // board info
    t.boolean("use_spoiler").notNullable().defaultTo(false);
    t.boolean("use_nsfw").notNullable().defaultTo(false);
    t.boolean("use_flag").notNullable().defaultTo(false);
    t.boolean("force_flag").notNullable().defaultTo(false);
    t.boolean("allow_multiple_flag").notNullable().defaultTo(false);

    // author
    t.string("default_nickname", 32);
    t.text("default_avatar_path");
    t.boolean("use_flair").notNullable().defaultTo(false);
    t.boolean("force_flair").notNullable().defaultTo(false);
    t.boolean("allow_post_manager_only").notNullable().defaultTo(false);
    t.boolean("use_public_chat").notNullable().defaultTo(false);
    t.boolean("use_email_only").notNullable().defaultTo(false);

    t.unique(["name"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}

