import { Knex } from "knex";

const table = "group_admins";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("user_id").notNullable().references("users.id").onDelete("CASCADE").onUpdate("CASCADE");
    t.integer("group_id").notNullable().references("groups.id").onDelete("CASCADE").onUpdate("CASCADE");

    t.boolean("is_super").defaultTo(false);
    t.boolean("manage_admin").defaultTo(true);
    t.boolean("manage_member").defaultTo(true);
    t.boolean("manage_censor").defaultTo(true);
    t.boolean("manage_intro").defaultTo(true);
    t.boolean("manage_category").defaultTo(true);
    t.boolean("manage_muter").defaultTo(true);

    t.unique(["group_id", "user_id"]);
    t.index("user_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(table);
}