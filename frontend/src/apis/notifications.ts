import { server } from "@/system/server";
import * as R from "@/types/Notification.api";
import type { ListNotificationOptionT } from "@/types";

const root = "/notifications";

export async function list(listOpt: ListNotificationOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}


export async function checkUnread(): Promise<R.CheckRsp> {
  const rsp = await server.post(`${root}/check`);
  return rsp.data;
}
