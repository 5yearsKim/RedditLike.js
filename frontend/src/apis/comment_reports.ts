import { server } from "@/system/server";
import * as R from "@/types/CommentReport.api";
import type { CommentReportFormT, ListCommentReportOptionT } from "@/types/CommentReport";

const root = "/comment-reports";

export async function create(form: CommentReportFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}


export async function list(listOpt: ListCommentReportOptionT): Promise<R.ListRsp> {
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