import { Knex } from "knex";

const funcName = "update_timestamp";

export async function up(knex: Knex): Promise<void> {
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
}


export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP FUNCTION IF EXISTS ${funcName}() CASCADE;
  `);
}

