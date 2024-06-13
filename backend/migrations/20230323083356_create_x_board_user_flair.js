

const table = "x_board_user_flair";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("flair_id").notNullable().references("flairs.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("board_user_id").notNullable().references("board_users.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.integer("rank");

    t.unique(["flair_id", "board_user_id"]);
    t.index("board_user_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};

