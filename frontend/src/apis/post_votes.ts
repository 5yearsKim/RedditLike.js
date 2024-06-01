import { server } from "@/system/server";
import * as R from "@/types/PostVote.api";
// import type {} from "@/types";

const root = "/post-votes";

export async function score(postId: idT, score: number): Promise<R.ScoreRsp> {
  const body: R.ScoreRqs = { postId, score };
  const rsp = await server.post(`${root}/score`, body);
  return rsp.data;
}