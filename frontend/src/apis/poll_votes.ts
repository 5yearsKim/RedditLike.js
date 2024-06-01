import { server } from "@/system/server";
import * as R from "@/types/PollVote.api";
// import type { ListPollVoteOptionT } from "@/types";

const root = "/poll-votes";

export async function vote(pollId: idT, candIds: idT[]): Promise<R.VoteRsp> {
  const body: R.VoteRqs = { pollId, candIds };
  const rsp = await server.post(`${root}/vote`, body);
  return rsp.data;
}
