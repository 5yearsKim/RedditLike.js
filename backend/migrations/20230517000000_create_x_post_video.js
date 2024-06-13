

const table = "x_post_video";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.integer("post_id").references("posts.id").onUpdate("CASCADE").onDelete("CASCADE");
    t.integer("video_id").references("videos.id").onUpdate("CASCADE").onDelete("CASCADE");

    t.integer("rank"); // just in case.. no need

    t.unique(["post_id", "video_id"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};


