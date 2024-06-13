const table = "board_managers";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("user_id").notNullable().references("users.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("board_id").notNullable().references("boards.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.boolean("is_super").notNullable().defaultTo(false);

    // t.boolean('is_accepted').notNullable().defaultTo(false);
    // content
    t.boolean("manage_censor").notNullable().defaultTo(true);
    // user
    t.boolean("manage_manager").notNullable().defaultTo(true);
    t.boolean("manage_muter").notNullable().defaultTo(true);
    t.boolean("manage_write").notNullable().defaultTo(true);
    // setting
    t.boolean("manage_intro").notNullable().defaultTo(true);
    t.boolean("manage_info").notNullable().defaultTo(true);
    t.boolean("manage_exposure").notNullable().defaultTo(true);
    t.boolean("manage_contents").notNullable().defaultTo(true);
    t.boolean("manage_etc").notNullable().defaultTo(true);

    t.unique(["user_id", "board_id"]);
    t.index("board_id");
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};

