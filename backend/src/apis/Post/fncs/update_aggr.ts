import { postM } from "@/models/Post";
import { knex } from "@/global/db";
import * as err from "@/errors";
import { differenceInMinutes } from "date-fns";
import type { PostT } from "@/types";

export type PostAggrOptionT = {
  numComment?: boolean
  voteInfo?: boolean
  hotScore?: boolean
}


export async function updateAggr(id: idT, opt: PostAggrOptionT): Promise<PostT|null> {
  let updated: PostT|null = null;
  if (opt.numComment) {
    // num_comment
    const rsp = await knex.count("*").from({ c: "comments" })
      .where("c.post_id", "=", id)
      .whereNull("c.trashed_at")
      .whereNull("c.deleted_at")
      .first();
    if (!rsp) {
      throw new err.NotAppliedE();
    }
    const { count: numComment } = rsp;
    updated = await postM.updateOne({ id }, { num_comment: numComment as number });
  }
  if (opt.voteInfo) {
    const rsp = await knex({ pv: "post_votes" })
      .select(
        knex.raw("COALESCE(SUM(pv.score), 0) AS score"),
        knex.count("pv.id").as("num_vote")
      )
      .where("pv.post_id", id)
      .first();

    if (!rsp) {
      throw new err.NotAppliedE();
    }
    const { score, num_vote: numVote } = rsp;
    updated = await postM.updateOne({ id }, { score: score as number, num_vote: numVote as number });
  }
  if (opt.hotScore) {
    const post = await knex("posts").select("*")
      .where("id", id)
      .whereNotNull("published_at")
      .whereNull("trashed_at").whereNull("deleted_at")
      .first();
    if (post) {
      const publishedAt = new Date(post.published_at);
      const hotScore = calcPostHotScore(publishedAt, post.score);
      updated = await postM.updateOne({ id }, { hot_score: hotScore });
    }
  }
  return updated;
}


function calcPostHotScore(publishedAt: Date, score: number): number {
  let hotScore = differenceInMinutes(publishedAt, new Date(2022, 1, 1 ) );

  if (score > 1) {
    hotScore += Math.log2(score) * 60;
  } else {
    hotScore += score * 60;
  }

  return hotScore;
}