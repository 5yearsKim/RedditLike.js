
const table = "post_reports";


exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("post_id").notNullable().references("posts.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("user_id").references("users.id").onDelete("SET NULL").onUpdate("CASCADE");

    t.string("category", 32); // enum
    t.string("reason", 255);

    t.dateTime("ignored_at");
    t.dateTime("resolved_at");

    t.unique(["post_id", "user_id"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};

