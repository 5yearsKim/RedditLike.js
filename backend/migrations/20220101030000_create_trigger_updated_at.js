
const funcName = "update_timestamp";

exports.up = function (knex) {
  return knex.raw(`--sql
    CREATE OR REPLACE FUNCTION ${funcName}() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$;
  `);
};


exports.down = function (knex) {
  return knex.raw(`
    DROP FUNCTION IF EXISTS ${funcName}() CASCADE;
  `);
};

