import { server } from "@/system/server";
import * as R from "@/types/CommentVote.api";
// import type {} from "@/types";

const root = "/comment-votes";

export async function score(commentId: idT, score: number): Promise<R.ScoreRsp> {
  const body: R.ScoreRqs = { commentId, score };
  const rsp = await server.post(`${root}/score`, body);
  return rsp.data;
}