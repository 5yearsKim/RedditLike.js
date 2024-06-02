import { Knex } from "knex";

const table = "users";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function (t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    // real field
    t.string("sub", 255).notNullable().unique();
    t.string("email", 255).unique();

    t.dateTime("deleted_at");
    t.dateTime("last_login_at");

    t.integer("points").defaultTo(0);

    // preference
    t.boolean("notify_comment_on_comment").defaultTo(true);
    t.boolean("notify_comment_on_post").defaultTo(true);
    t.boolean("notify_trash_post").defaultTo(true);
    t.boolean("notify_trash_comment").defaultTo(true);
    t.boolean("allow_chat_push").defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}
