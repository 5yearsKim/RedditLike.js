
const table = "flair_boxes";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").notNullable().references("boards.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.boolean("is_editable").defaultTo(false);
    t.boolean("is_multiple").defaultTo(false);
    t.boolean("is_force").defaultTo(false);

    t.string("name").notNullable();
    t.text("description");

    t.index("board_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};

