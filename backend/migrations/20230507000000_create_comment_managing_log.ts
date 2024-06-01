import { Knex } from "knex";

const table = "comment_managing_logs";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("board_id").notNullable().references("boards.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("user_id").notNullable().references("users.id").onUpdate("CASCADE");
    t.integer("comment_id").notNullable().references("comments.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.enu("type", ["approve", "trash", "rewrite"]);
    t.string("managed_by");
    t.text("memo");

    t.index("comment_id");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}
