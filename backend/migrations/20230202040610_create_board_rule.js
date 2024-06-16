
const table = "board_rules";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").notNullable().references("boards.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.string("title", 255).notNullable();
    t.string("alias", 255);
    t.enu("range", ["all", "post", "comment"]).defaultTo("all");
    t.text("description").notNullable();
    t.integer("rank");

    t.index("board_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};


