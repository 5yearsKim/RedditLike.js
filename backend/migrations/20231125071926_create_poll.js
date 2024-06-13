

const table = "polls";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("author_id").notNullable().references("users.id").onUpdate("CASCADE");
    t.string("title", 255);
    t.text("description");

    t.boolean("allow_multiple").defaultTo(false);
    t.dateTime("expires_at");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};