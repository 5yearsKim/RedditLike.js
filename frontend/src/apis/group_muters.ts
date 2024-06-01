import { server } from "@/system/server";
import * as R from "@/types/GroupMuter.api";
import type { GroupMuterFormT, ListGroupMuterOptionT } from "@/types";

const root = "/group-muters";

export async function create(form: GroupMuterFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function list(listOpt: ListGroupMuterOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function getMe(groupId: idT): Promise<R.GetMeRsp> {
  const params: R.GetMeRqs = { groupId };
  const rsp = await server.get(`${root}/me`, { params });
  return rsp.data;
}
