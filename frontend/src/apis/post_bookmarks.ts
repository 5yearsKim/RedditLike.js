import { server } from "@/system/server";
import * as R from "@/types/PostBookmark.api";
import type { PostBookmarkFormT } from "@/types";

const root = "/post-bookmarks";


export async function create(form: PostBookmarkFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}


export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}