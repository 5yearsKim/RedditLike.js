

const table = "url_infos";

exports.up = function (knex) {
  return knex.schema.createTable(table, function(t) {
    t.increments("id").primary().unsigned();
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    t.dateTime("updated_at");

    t.text("url").notNullable();
    t.text("title");
    t.text("description");
    t.text("image");
    t.text("sitename");
    t.text("hostname");

    t.unique(["url"]);
  });
};


exports.down = function (knex) {
  return knex.schema.dropTableIfExists(table);
};