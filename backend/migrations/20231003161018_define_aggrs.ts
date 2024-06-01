import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropMaterializedViewIfExists("comment_aggr");
  await knex.schema.dropMaterializedViewIfExists("post_aggr");
  await knex.schema.dropMaterializedViewIfExists("board_aggr");

  //**********
  // boards
  //**********
  await knex.raw(`--sql
  CREATE OR REPLACE FUNCTION calc_board_hot_score(bid INTEGER)
  RETURNS numeric AS $$
  DECLARE
    hot_score FLOAT := 0;
  BEGIN
    SELECT SUM( (CASE WHEN content_source IS NULL THEN 1000 ELSE 100 END) / (60 + EXTRACT(EPOCH FROM (NOW() - published_at)))) INTO hot_score
    FROM (
      SELECT published_at, content_source
      FROM posts
      WHERE board_id = bid AND published_at IS NOT NULL AND deleted_at IS NULL AND trashed_at IS NULL
      ORDER BY published_at DESC
      LIMIT 8
    ) AS recent_posts;
    RETURN hot_score;
  END;
  $$ LANGUAGE plpgsql;
  `);

  await knex.schema.createMaterializedView("board_aggr", function (view) {
    view.as(
      knex({ b: "boards" })
        .select(
          "b.id",
          "b.created_at",
          knex({ bf: "board_followers" }).count("*").whereRaw("bf.board_id = b.id").as("num_follower"),
          knex({ p: "posts" }).count("*").whereRaw("p.board_id = b.id").whereNotNull("p.published_at").whereNull("p.deleted_at").whereNull("p.trashed_at").as("num_post"),
          knex.select(knex.raw("calc_board_hot_score(b.id)")).as("hot_score"),
        ),
    );
  });

  await knex.raw("CREATE UNIQUE INDEX ON board_aggr (id)");
  await knex.raw("CREATE INDEX ON board_aggr (num_follower)");
  await knex.raw("CREATE INDEX ON board_aggr (hot_score)");

  //***** */
  // post_aggr
  //***** */

  await knex.raw(`--sql
    CREATE OR REPLACE FUNCTION calc_post_hot_score(score integer, num_vote bigint, published_at timestamp with time zone, num_follower bigint, content_source text)
    RETURNS numeric AS $$
    BEGIN
      IF published_at IS NULL THEN
        RETURN NULL;
      ELSE 
        RETURN 100 
        + (CASE WHEN score < 2 THEN score ELSE 1 + LOG(2, score) END)
        - 4 * LOG(2, 3600 + ABS(EXTRACT(epoch FROM (NOW() - published_at)))) 
        - (CASE WHEN content_source IS NULL THEN 0 ELSE 1 END) * LOG(2, 1 + ABS(EXTRACT(epoch FROM (NOW() - published_at)))) 
        - LOG(4, 4 + num_follower);
      END IF;
    END;
    $$ LANGUAGE plpgsql;
  `);


  await knex.schema.createMaterializedView("post_aggr", function (view) {
    view.as(
      knex
        .with(
          "with_post",
          knex({ p: "posts" }).select(
            "p.id",
            "p.board_id",
            "p.created_at",
            "p.published_at",
            "p.content_source",
            // num_vote
            knex.count("pv.id").as("num_vote"),
            // score
            knex.raw("COALESCE(SUM(pv.score), 0)::integer AS score"),
          )
            .leftJoin("post_votes AS pv", "p.id", "=", "pv.post_id")
            .groupBy("p.id"),
        )
        .select(
          "wp.*",
          // num_comment
          knex.count("*").from({ c: "comments" }).whereRaw("c.post_id = wp.id").as("num_comment"),
          // hot_score
          knex.select(knex.raw("calc_post_hot_score(wp.score, wp.num_vote, wp.published_at, ba.num_follower, wp.content_source)::numeric")).as("hot_score"),
        )
        .from({ wp: "with_post" })
        .leftJoin("board_aggr AS ba", "ba.id", "=", "wp.board_id"),
    );
  });

  await knex.raw("CREATE UNIQUE INDEX ON post_aggr (id)");
  await knex.raw("CREATE INDEX ON post_aggr (num_comment)");
  await knex.raw("CREATE INDEX ON post_aggr (hot_score)");

  //****
  // comment_aggr
  //****/

  await knex.raw(`--sql
    CREATE OR REPLACE FUNCTION calc_num_children( cid integer)
    RETURNS integer AS $$
    WITH RECURSIVE descendants AS (
      SELECT id, parent_id
      FROM comments
      WHERE id = cid

      UNION ALL

      SELECT comments.id, comments.parent_id
      FROM comments
      JOIN descendants ON descendants.id = comments.parent_id
      )
      SELECT count(*) - 1 -- subtract 1 to exclude the original comment
      FROM descendants;

    $$ LANGUAGE SQL;
  `);


  await knex.schema.createMaterializedView("comment_aggr", function (view) {
    view.as(
      knex({ c: "comments" })
        .select(
          "c.id AS id",
          "c.created_at AS created_at",
          "c.post_id AS post_id",
          knex.count("cv.id").as("num_vote"),
          // score
          knex.select(knex.raw("COALESCE(SUM(cv.score), 0)::integer")).as("score"),
          knex.select(knex.raw("calc_num_children(c.id)")).as("num_children"),
        )
        .leftJoin("comment_votes AS cv", "c.id", "=", "cv.comment_id")
        .groupBy("c.id"),
    );
  });

  await knex.raw("CREATE UNIQUE INDEX ON comment_aggr (id)");
  await knex.raw("CREATE INDEX ON comment_aggr (score DESC)");
  await knex.raw("CREATE INDEX ON comment_aggr (num_children)");
}
// hot, new, top (with period), trending
// myboard, all, mixed


export async function down(knex: Knex): Promise<void> {

  // comment_aggr
  await knex.raw("DROP FUNCTION IF EXISTS cal_num_children(integer)");
  await knex.schema.dropMaterializedViewIfExists("comment_aggr");

  // post_aggr
  await knex.raw("DROP FUNCTION IF EXISTS cal_post_steady_score(integer) CASCADE;");
  await knex.raw("DROP FUNCTION IF EXISTS cal_post_hot_score(integer, integer, timestamp, text) CASCADE;");
  await knex.schema.dropMaterializedViewIfExists("post_aggr");

  // board_aggr
  await knex.raw("DROP FUNCTION IF EXISTS cal_board_hot_score(integer) CASCADE;");
  await knex.schema.dropMaterializedViewIfExists("board_aggr");


}