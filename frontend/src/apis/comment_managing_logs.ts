import { server } from "@/system/server";
import * as R from "@/types/CommentManagingLog.api";
import type { ListCommentManagingLogOptionT } from "@/types";

const root = "/comment-managing-logs";

export async function list(listOpt: ListCommentManagingLogOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}
