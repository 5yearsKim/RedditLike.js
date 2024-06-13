

const table = "board_blocks";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").references("boards.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("user_id").references("users.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.unique(["user_id", "board_id"]);
    t.index("board_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};