import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.raw(`--sql
    ALTER TABLE posts
    ADD COLUMN hot_score REAL DEFAULT 0 NOT NULL;

    CREATE INDEX posts_hot_score_index ON posts(hot_score);

    ALTER TABLE posts
    ADD COLUMN num_vote INTEGER DEFAULT 0 NOT NULL;

    ALTER TABLE posts
    ADD COLUMN score INTEGER DEFAULT 0 NOT NULL;

    CREATE INDEX posts_score_index ON posts(score);

    ALTER TABLE posts
    ADD COLUMN num_comment INTEGER DEFAULT 0 NOT NULL;

    CREATE INDEX posts_num_comment_index ON posts(num_comment);
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw(`--sql
    DROP INDEX IF EXISTS posts_num_comment_index;
    ALTER TABLE posts DROP COLUMN IF EXISTS num_comment;

    DROP INDEX IF EXISTS posts_score_index;
    ALTER TABLE posts DROP COLUMN IF EXISTS score;

    DROP INDEX IF EXISTS posts_hot_score_index;
    ALTER TABLE posts DROP COLUMN IF EXISTS hot_score;

    DROP INDEX IF EXISTS posts_num_vote_index;
    ALTER TABLE posts DROP COLUMN IF EXISTS num_vote;
  `);
}