
const table = "comments";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("author_id").references("users.id").onDelete("SET NULL").onUpdate("CASCADE");
    t.integer("post_id").notNullable().references("posts.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.text("body");
    t.enu("body_type", ["html", "md"]).defaultTo("md");
    t.specificType("path", "ltree");
    t.integer("parent_id").references(`${table}.id`).onUpdate("CASCADE").onDelete("CASCADE");

    t.boolean("ignore_report").defaultTo(false);

    t.dateTime("published_at");
    t.dateTime("rewrite_at");
    t.dateTime("deleted_at");


    t.dateTime("trashed_at");
    t.string("trashed_by");
    t.dateTime("approved_at");
    t.boolean("show_manager");

    t.index("author_id");
    t.index("post_id");
    t.index("path", "GIST");
    t.index("parent_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};

