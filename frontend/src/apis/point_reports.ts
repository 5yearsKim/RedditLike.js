import { server } from "@/system/server";
import * as R from "@/types/PointReport.api";
import type { ListPointReportOptionT } from "@/types/PointReport";

const root = "/point-reports";

export async function list(listOpt: ListPointReportOptionT): Promise<R.ListRsp> {
  const params = listOpt;
  const rsp = await server.get(root + "/", { params });
  return rsp.data;
}

export async function checkItem(reportId: idT): Promise<R.CheckRsp> {
  const rsp = await server.patch(root + `/check/${reportId}`);
  return rsp.data;
}

export async function checkAll(): Promise<R.CheckAllRsp> {
  const rsp = await server.put(root + "/check-all");
  return rsp.data;
}
