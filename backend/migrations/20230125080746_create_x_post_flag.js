
const table = "x_post_flag";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("flag_id").notNullable().references("flags.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("post_id").notNullable().references("posts.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.integer("rank"); // just in case.. no need

    t.unique(["post_id", "flag_id"]);
    t.index("flag_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};

