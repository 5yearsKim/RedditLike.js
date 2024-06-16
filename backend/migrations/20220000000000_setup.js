
exports.up = function (knex) {
  return knex.raw(`
    CREATE EXTENSION IF NOT EXISTS "ltree";
  `);
};


exports.down = function (knex) {
  return knex.raw(`
  `);
};

