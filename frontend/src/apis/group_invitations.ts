import { server } from "@/system/server";
import * as R from "@/types/GroupInvitation.api";
import type { ListGroupInvitationOptionT } from "@/types";

const root = "/group-invitations";

export async function list(listOpt: ListGroupInvitationOptionT): Promise<R.ListRsp> {
  const params = listOpt satisfies R.ListRqs;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function invite(groupId: idT, email: string): Promise<R.InviteRsp> {
  const body: R.InviteRqs = { groupId, email };
  const rsp = await server.post(`${root}/invite`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}