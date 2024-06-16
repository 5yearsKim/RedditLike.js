

const table = "poll_cands";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("poll_id").notNullable().references("polls.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.string("label", 255).notNullable();
    t.text("thumb_path");
    t.integer("rank");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};