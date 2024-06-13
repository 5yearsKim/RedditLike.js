
const table = "post_votes";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("user_id").notNullable().references("users.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("post_id").notNullable().references("posts.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.integer("score").notNullable();

    t.unique(["user_id", "post_id"]);
    t.check("score = 1 or score = -1");
    t.index("post_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};

