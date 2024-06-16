
const table = "comment_votes";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("user_id").notNullable().references("users.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("comment_id").notNullable().references("comments.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.integer("score").notNullable();

    t.unique(["user_id", "comment_id"]);
    t.check("score = 1 or score = -1");
    t.index("comment_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};

