import { server } from "@/system/server";
import * as R from "@/types/GroupAdmin.api";
import type { GroupAdminFormT, ListGroupAdminOptionT } from "@/types";

const root = "/group-admins";

export async function create(form: GroupAdminFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(id: idT, form: Partial<GroupAdminFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function list(listOpt: ListGroupAdminOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function createByEmail(email: string, groupId: idT): Promise<R.CreateByEmailRsp> {
  const body: R.CreateByEmailRqs = { email, groupId };
  const rsp = await server.post(`${root}/by-email`, body);
  return rsp.data;
}

export async function getMe(groupId: idT): Promise<R.GetMeRsp> {
  const params: R.GetMeRqs = { groupId };
  const rsp = await server.get(`${root}/me`, { params });
  return rsp.data;
}