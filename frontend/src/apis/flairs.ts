import { server } from "@/system/server";
import * as R from "@/types/Flair.api";
import type { FlairFormT } from "@/types";

const root = "/flairs";

export async function create(form: FlairFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(id: idT, form: Partial<FlairFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function rerank(boxId: idT, flairIds: idT[]): Promise<R.RerankRsp> {
  const body: R.RerankRqs = { boxId, flairIds };
  const rsp = await server.put(`${root}/rerank`, body);
  return rsp.data;
}


export async function createCustom(form: FlairFormT): Promise<R.CreateCustomRsp> {
  const body: R.CreateCustomRqs = { form };
  const rsp = await server.post(`${root}/custom`, body);
  return rsp.data;
}

export async function removeCustom(id: idT): Promise<R.DeleteCustomRsp> {
  const rsp = await server.delete(`${root}/custom/${id}`);
  return rsp.data;
}