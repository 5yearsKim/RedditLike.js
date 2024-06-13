
const table = "x_user_category";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("category_id").references("categories.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("user_id").references("users.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.unique(["category_id", "user_id"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};