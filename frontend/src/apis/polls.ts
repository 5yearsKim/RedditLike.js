import { server } from "@/system/server";
import * as R from "@/types/Poll.api";
import type { PollFormT, GetPollOptionT, PollCandFormT } from "@/types";

const root = "/polls";

export async function get(id: idT, getOpt: GetPollOptionT = {}): Promise<R.GetRsp> {
  const params: R.GetRqs = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

export async function create(
  form: PollFormT,
  relations?: {cands?: PollCandFormT[]},
): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form, relations };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(
  id: idT,
  form: PollFormT,
  relations?: {cands?: PollCandFormT[]},
): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form, relations };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}
