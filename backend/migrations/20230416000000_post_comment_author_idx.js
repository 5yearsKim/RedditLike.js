
const table = "post_comment_author_idx";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.integer("post_id").notNullable().references("posts.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("author_id").notNullable().references("users.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.integer("idx").unsigned().notNullable();
    t.primary(["post_id", "author_id"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};


