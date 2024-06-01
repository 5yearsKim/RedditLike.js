import { server } from "@/system/server";
import * as R from "@/types/Group.api";
import { GetGroupOptionT, ListGroupOptionT, GroupFormT } from "@/types/Group";

const root = "/groups";

export async function get(id: idT, option: GetGroupOptionT = {}): Promise<R.GetRsp> {
  const params: R.GetRqs = option;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

export async function getByKey(key: string, getOpt: GetGroupOptionT = {}): Promise<R.GetByKeyRsp> {
  const params: R.GetByKeyRqs = getOpt;
  const rsp = await server.get(`${root}/key/${key}`, { params });
  return rsp.data;
}

export async function update(id: idT, form: Partial<GroupFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function list(option: ListGroupOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = option;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}


export async function getAvatarPresignedUrl(groupId: idT, mimeType: string): Promise<R.AvatarPresignedUrlRsp> {
  const body: R.AvatarPresignedUrlRqs = { groupId, mimeType };
  const rsp = await server.post(`${root}/avatar/presigned-url`, body);
  return rsp.data;
}