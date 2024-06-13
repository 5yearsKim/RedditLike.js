

const table = "board_users";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("user_id").references("users.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("board_id").references("boards.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.string("nickname", 32);
    t.text("avatar_path");

    t.unique(["user_id", "board_id"]);
    t.unique(["board_id", "nickname"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};