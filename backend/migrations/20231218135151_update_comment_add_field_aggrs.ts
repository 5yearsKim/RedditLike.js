import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.raw(`--sql

    ALTER TABLE comments
    ADD COLUMN num_vote INTEGER DEFAULT 0 NOT NULL;

    ALTER TABLE comments
    ADD COLUMN score INTEGER DEFAULT 0 NOT NULL;

    ALTER TABLE comments
    ADD COLUMN num_children INTEGER DEFAULT 0 NOT NULL;

  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw(`--sql

    ALTER TABLE comments
    DROP COLUMN IF EXISTS num_children;

    ALTER TABLE comments
    DROP COLUMN IF EXISTS score;

    ALTER TABLE comments
    DROP COLUMN IF EXISTS num_vote;

  `);
}

