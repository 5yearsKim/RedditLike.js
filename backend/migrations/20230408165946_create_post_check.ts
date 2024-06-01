import { Knex } from "knex";

const table = "post_checks";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("post_id").notNullable().references("posts.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("user_id").references("users.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.specificType("ip_addr", "inet");
    t.boolean("is_dummy");

    t.index(["user_id", "post_id"]);
    t.unique(["post_id", "user_id"]);
    t.unique(["post_id", "ip_addr"]);
    t.check("?? IS NOT NULL OR ?? IS NOT NULL", ["user_id", "ip_addr"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}