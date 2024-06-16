
const table = "categories";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.string("label", 32).notNullable();
    t.integer("parent_id").references(`${table}.id`).onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("rank");

    t.unique(["label"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};