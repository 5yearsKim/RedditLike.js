import { Injectable } from "@nestjs/common";
import { pollVoteM } from "@/models/PollVote";
import { knex } from "@/global/db";
// import * as err from "@/errors";
import type { PollVoteFormT } from "@/types/PollVote";

@Injectable()
export class PollVoteService {
  constructor() {}

  async vote(pollId: idT, userId: idT, candIds: idT[]): Promise<void> {
    await knex.transaction(async (trx) => {
      await knex.delete()
        .from("poll_votes")
        .leftJoin("poll_cands", "poll_votes.cand_id", "poll_cands.id")
        .whereRaw(`poll_votes.user_id = ${userId} AND poll_cands.poll_id = ${pollId}`)
        .transacting(trx);
      const forms: PollVoteFormT[] = candIds.map((candId) => ({
        user_id: userId,
        cand_id: candId,
      }));
      await pollVoteM.createMany(forms, { trx });
    });
  }
}