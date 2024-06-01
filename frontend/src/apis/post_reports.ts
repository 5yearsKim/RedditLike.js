import { server } from "@/system/server";
import * as R from "@/types/PostReport.api";
import type { PostReportFormT, ListPostReportOptionT } from "@/types/PostReport";

const root = "/post-reports";

export async function create(form: PostReportFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}


export async function list(listOpt: ListPostReportOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}


export async function ignore(id: idT): Promise<R.IgnoreRsp> {
  const rsp = await server.patch(`${root}/${id}/ignore`);
  return rsp.data;
}

export async function resolve(id: idT): Promise<R.ResolveRsp> {
  const rsp = await server.patch(`${root}/${id}/resolve`);
  return rsp.data;
}