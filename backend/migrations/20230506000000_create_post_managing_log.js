
const table = "post_managing_logs";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").notNullable().references("boards.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("user_id").notNullable().references("users.id").onUpdate("CASCADE");
    t.integer("post_id").notNullable().references("posts.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.enu("type", ["approve", "trash", "rewrite"]);
    t.string("managed_by");
    t.text("memo");

    t.index("post_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};


