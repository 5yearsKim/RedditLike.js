

exports.up = async function (knex) {
  await knex.raw(`--sql
    ALTER TABLE boards
    ADD COLUMN hot_score REAL DEFAULT 0 NOT NULL;

    CREATE INDEX boards_hot_score_index ON boards(hot_score);

    ALTER TABLE boards
    ADD COLUMN num_follower INTEGER DEFAULT 0 NOT NULL;

    CREATE INDEX boards_num_follower_index ON boards(num_follower);


    ALTER TABLE boards
    ADD COLUMN num_post INTEGER DEFAULT 0 NOT NULL;

  `);
};


exports.down = async function (knex) {
  await knex.raw(`--sql

    ALTER TABLE boards
    DROP COLUMN IF EXISTS num_post;

    DROP INDEX IF EXISTS boards_num_follower_index;

    ALTER TABLE boards
    DROP COLUMN IF EXISTS num_follower;

    DROP INDEX IF EXISTS boards_hot_score_index;

    ALTER TABLE boards
    DROP COLUMN IF EXISTS hot_score;
  `);
};
