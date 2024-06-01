import { Injectable } from "@nestjs/common";
import { commentVoteM } from "@/models/CommentVote";
import type { CommentVoteFormT, CommentVoteT } from "@/models/CommentVote";
import * as err from "@/errors";

@Injectable()
export class CommentVoteService {
  constructor() {}

  async score(userId: idT, commentId: idT, score: number): Promise<CommentVoteT|null> {
    let vote: CommentVoteT|null = null;

    if (score === 1 || score === -1) { // upsert score
      const form: CommentVoteFormT = {
        user_id: userId,
        comment_id: commentId,
        score: score,
      };
      const created = await commentVoteM.upsert(form, {
        onConflict: ["user_id", "comment_id"],
      });
      vote = created;
    } else if (score === 0) { // delete exists
      const deleted = await commentVoteM.deleteOne({
        user_id: userId,
        comment_id: commentId,
      });
      vote = deleted;
    } else {
      throw new err.InvalidDataE(`vote score with ${score} not valid`);
    }
    return vote;
  }
}