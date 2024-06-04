import { server } from "@/system/server";
import * as R from "@/types/Admin.api";
import type { AdminFormT, ListAdminOptionT } from "@/types";

const root = "/admins";

export async function create(form: AdminFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(id: idT, form: Partial<AdminFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function list(listOpt: ListAdminOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function createByEmail(email: string): Promise<R.CreateByEmailRsp> {
  const body: R.CreateByEmailRqs = { email };
  const rsp = await server.post(`${root}/by-email`, body);
  return rsp.data;
}

export async function getMe(): Promise<R.GetMeRsp> {
  const rsp = await server.get(`${root}/me`);
  return rsp.data;
}