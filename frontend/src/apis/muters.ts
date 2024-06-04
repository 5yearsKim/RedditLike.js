import { server } from "@/system/server";
import * as R from "@/types/Muter.api";
import type { MuterFormT, ListMuterOptionT } from "@/types";

const root = "/muters";

export async function create(form: MuterFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function list(listOpt: ListMuterOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function getMe(): Promise<R.GetMeRsp> {
  const rsp = await server.get(`${root}/me`);
  return rsp.data;
}
