

const table = "chat_messages";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("room_id").references("chat_rooms.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("sender_id").references("users.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.text("body");

    t.dateTime("trashed_at");

    t.index(["room_id", "created_at"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};