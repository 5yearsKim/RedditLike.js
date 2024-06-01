import { commentM } from "@/models/Comment";
import { knex } from "@/global/db";
import * as err from "@/errors";
import type { CommentT } from "@/types";

export type CommentAggrOptionT = {
  numChildren?: boolean
  voteInfo?: boolean
}

export async function updateAggr(id: idT, opt: CommentAggrOptionT): Promise<CommentT|null> {
  let updated: CommentT|null = null;
  if (opt.numChildren) {

    const rsp = await knex
      .withRecursive("descendants", (qb) => {
        qb.select("id", "parent_id")
          .from("comments")
          .where("id", id)
          .union((qb) => {
            qb.select("comments.id", "comments.parent_id")
              .from("comments")
              .whereNull("trashed_at").whereNull("deleted_at")
              .join("descendants", "descendants.id", "comments.parent_id");
          });
      })
      .select(knex.raw("COUNT(*) - 1 AS num_children"))
      .from("descendants")
      .first();

    if (!rsp) {
      throw new err.NotAppliedE();
    }
    const { num_children: numChildren } = rsp as any;
    updated = await commentM.updateOne({ id }, { num_children: numChildren as number });

    // const rsp = await knex.raw(`--sql
    //   WITH RECURSIVE descendants AS (
    //     SELECT id, parent_id
    //     FROM comments
    //     WHERE id = ${id}

    //     UNION ALL

    //     SELECT comments.id, comments.parent_id
    //     FROM comments
    //     JOIN descendants ON descendants.id = comments.parent_id
    //     )
    //     SELECT count(*) - 1 -- subtract 1 to exclude the original comment
    //     FROM descendants;
    // `);

  }
  if (opt.voteInfo) {
    const rsp = await knex({ cv: "comment_votes" })
      .select(
        knex.raw("COALESCE(SUM(cv.score), 0) AS score"),
        knex.count("cv.id").as("num_vote")
      )
      .where("cv.comment_id", id)
      .first();

    if (!rsp) {
      throw new err.NotAppliedE();
    }
    const { score, num_vote: numVote } = rsp;
    updated = await commentM.updateOne({ id }, { score: score as number, num_vote: numVote as number });
  }
  return updated;
}