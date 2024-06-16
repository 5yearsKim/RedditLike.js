

const table = "poll_votes";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("user_id").notNullable().references("users.id").onUpdate("CASCADE");
    t.integer("cand_id").notNullable().references("poll_cands.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.unique(["user_id", "cand_id"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};
