

const table = "chat_users";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("room_id").references("chat_rooms.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("user_id").references("users.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.dateTime("last_checked_at");
    t.dateTime("deleted_at");

    t.unique(["room_id", "user_id"]);
    t.index(["user_id"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};