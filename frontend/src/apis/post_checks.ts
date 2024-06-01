import { server } from "@/system/server";
import * as R from "@/types/PostCheck.api";
// import type {} from "@/types";

const root = "/post-checks";

export async function check(postId: idT, type: "user"|"ip"): Promise<R.CheckRsp> {
  const body: R.CheckRqs = { postId, type };
  const rsp = await server.post(`${root}/check`, body);
  return rsp.data;
}