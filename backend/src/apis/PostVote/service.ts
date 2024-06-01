import { Injectable } from "@nestjs/common";
import type { PostVoteFormT, PostVoteT } from "@/models/PostVote";
import { postVoteM } from "@/models/PostVote";
import * as err from "@/errors";

@Injectable()
export class PostVoteService {
  constructor() {}

  async score(userId: idT, postId: idT, score: number): Promise<PostVoteT|null> {
    let vote: PostVoteT|null = null;

    if (score === 1 || score === -1) { // upsert score
      const form: PostVoteFormT = {
        user_id: userId,
        post_id: postId,
        score: score,
      };
      const created = await postVoteM.upsert(form, {
        onConflict: ["user_id", "post_id"],
      });
      vote = created;
    } else if (score === 0) { // delete exists
      const deleted = await postVoteM.deleteOne({
        user_id: userId,
        post_id: postId,
      });
      vote = deleted;
    } else {
      throw new err.InvalidDataE(`vote score with ${score} not valid`);
    }
    return vote;
  }
}