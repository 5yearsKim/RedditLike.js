import { server } from "@/system/server";
import * as R from "@/types/PostManagingLog.api";
import type { ListPostManagingLogOptionT } from "@/types";

const root = "/post-managing-logs";

export async function list(listOpt: ListPostManagingLogOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}
