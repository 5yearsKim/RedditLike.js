

const table = "post_pins";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").references("boards.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("post_id").references("posts.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.integer("rank");

    t.unique(["board_id", "post_id"]);
    t.index("post_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};