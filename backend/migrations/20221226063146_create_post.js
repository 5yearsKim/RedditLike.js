
const table = "posts";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();

    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("author_id").references("users.id").onDelete("SET NULL").onUpdate("CASCADE");
    t.integer("board_id").notNullable().references("boards.id").onUpdate("CASCADE");
    t.string("title", 255).notNullable();
    t.text("body");
    t.enu("body_type", ["md", "html"]).defaultTo("md");

    t.boolean("is_nsfw").defaultTo(false);
    t.boolean("is_spoiler").defaultTo(false);
    t.boolean("ignore_report").defaultTo(false);

    t.dateTime("published_at");
    t.dateTime("rewrite_at");
    t.dateTime("deleted_at");

    t.dateTime("trashed_at");
    t.string("trashed_by");
    t.dateTime("approved_at");
    t.dateTime("reserved_at");
    t.boolean("show_manager").defaultTo(false);

    t.text("content_source");
    t.text("thumb_path");

    t.index("author_id");
    t.index("board_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};
