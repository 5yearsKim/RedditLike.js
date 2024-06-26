

const table = "chat_rooms";

exports.up = async function (knex) {
  await knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").references("boards.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.boolean("is_public").defaultTo(false);

    t.dateTime("last_message_at");

    t.index(["board_id"]);
  });

  await knex.schema.raw(`--sql
  CREATE UNIQUE INDEX idx_unique_board_id_if_public
  ON chat_rooms (board_id)
  WHERE is_public = true;
  `);

};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};