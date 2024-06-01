import { server } from "@/system/server";
import * as R from "@/types/FlairBox.api";
import type { FlairBoxFormT, ListFlairBoxOptionT, GetFlairBoxOptionT } from "@/types";

const root = "/flair-boxes";

export async function get(id: idT, getOpt: GetFlairBoxOptionT = {}): Promise<R.GetRsp> {
  const params : R.GetRqs = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

export async function create(form: FlairBoxFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(id: idT, form: Partial<FlairBoxFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function list(listOpt: ListFlairBoxOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}
