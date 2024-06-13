

const table = "muters";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("user_id").notNullable().references("users.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.dateTime("until");
    t.string("reason", 255);

    t.unique("user_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};