import { boardM } from "@/models/Board";
import * as err from "@/errors";
import { knex } from "@/global/db";
import { differenceInMinutes } from "date-fns";
import type { BoardT } from "@/types";

export type BoardAggrOptionT = {
  num_follower?: boolean,
  num_post?: boolean,
  hot_score?: boolean
}

export async function updateAggr(id: idT, opt: BoardAggrOptionT): Promise<BoardT|null> {
  let updated: BoardT|null = null;

  if (opt.num_follower) {
    const rsp = await knex("board_followers").count("id").where("board_id", id).first();
    if (!rsp) {
      throw new err.NotAppliedE();
    }
    const { count: numFollower } = rsp;
    updated = await boardM.updateOne({ id }, { num_follower: numFollower as number });
  }

  if (opt.num_post) {
    const rsp = await knex("posts").count("id")
      .where("board_id", id)
      .whereNotNull("published_at")
      .whereNull("trashed_at").whereNull("deleted_at")
      .first();
    if (!rsp) {
      throw new err.NotAppliedE();
    }
    const { count: numPost } = rsp;
    updated = await boardM.updateOne({ id }, { num_post: numPost as number });
  }

  if (opt.hot_score) {
    const post = await knex("posts").select("*")
      .where("board_id", id)
      .whereNotNull("published_at")
      .whereNull("trashed_at").whereNull("deleted_at")
      .orderByRaw("published_at DESC")
      .first();
    if (post) {
      const publishedAt = new Date(post.published_at);
      const hotScore = differenceInMinutes(publishedAt, new Date(2022, 1, 1 ) );
      updated = await boardM.updateOne({ id }, { hot_score: hotScore });
    }
  }
  return updated;
}