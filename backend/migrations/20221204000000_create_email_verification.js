
const table = "email_verifications";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.string("email").notNullable();
    t.boolean("is_verified").defaultTo(false);
    t.string("code").notNullable();
    t.integer("trial").defaultTo(0);

    t.index(["email"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};