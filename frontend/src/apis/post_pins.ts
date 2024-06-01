import { server } from "@/system/server";
import * as R from "@/types/PostPin.api";
import type { PostPinFormT } from "@/types";

const root = "/post-pins";

export async function create(form: PostPinFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function remove(boardId: idT, postId: idT): Promise<R.DeleteRsp> {
  const body: R.DeleteRqs = { postId, boardId };
  const rsp = await server.delete(`${root}`, { data: body });
  return rsp.data;
}