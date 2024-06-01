import { server } from "@/system/server";
import * as R from "@/types/PointEvent.api";
import type { ListPointEventOptionT } from "@/types/PointEvent";

const root = "/point-events";


export async function list(listOpt: ListPointEventOptionT): Promise<R.ListRsp> {
  const params = listOpt;
  const rsp = await server.get(root + "/", { params });
  return rsp.data;
}
