import { server } from "@/system/server";
import * as R from "@/types/BoardFollower.api";

const root = "/board-followers";

export async function follow(boardId: idT): Promise<R.FollowRsp> {
  const body: R.FollowRqs = { boardId };
  const rsp = await server.post(`${root}/follow`, body);
  return rsp.data;
}


export async function unfollow(boardId: idT): Promise<R.UnfollowRsp> {
  const body: R.UnfollowRqs = { boardId };
  const rsp = await server.post(`${root}/unfollow`, body);
  return rsp.data;
}