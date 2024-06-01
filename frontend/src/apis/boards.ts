import { server } from "@/system/server";
import * as R from "@/types/Board.api";
import type { BoardFormT, GetBoardOptionT, ListBoardOptionT } from "@/types/Board";

const root = "/boards";

export async function get(id: idT, option: GetBoardOptionT = {}): Promise<R.GetRsp> {
  const params: R.GetRqs = option;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}


export async function getWithGroupCheck(id: idT, groupKey: string, option: GetBoardOptionT = {}): Promise<R.GetWithGroupCheckRsp> {
  const params: R.GetWithGroupCheckRqs = option;
  const rsp = await server.get(`${root}/${id}/group-check/${groupKey}`, { params });
  return rsp.data;
}

export async function list(option: ListBoardOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = option;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function create(form: BoardFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(id: idT, form: Partial<BoardFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function adminTrash(id: idT): Promise<R.AdminTrashRsp> {
  const rsp = await server.patch(`${root}/${id}/admin-trash`);
  return rsp.data;
}

export async function adminRestore(id: idT): Promise<R.AdminRestoreRsp> {
  const rsp = await server.patch(`${root}/${id}/admin-restore`);
  return rsp.data;
}

export async function getByNameAndGroup(name: string, groupId: idT, option: GetBoardOptionT = {}): Promise<R.ByNameAndGroupRsp> {
  const params: R.ByNameAndGroupRqs = option;
  const rsp = await server.get(`${root}/by-name/${name}/group/${groupId}`, { params });
  return rsp.data;
}

export async function getAvatarPresignedUrl(boardId: idT, mimeType: string): Promise<R.AvatarPresignedUrlRsp> {
  const body = { boardId, mimeType } as R.AvatarPresignedUrlRqs;
  const rsp = await server.post(`${root}/avatar/presigned-url`, body);
  return rsp.data;
}

export async function getBgCoverPresignedUrl(boardId: idT, mimeType: string): Promise<R.BgCoverPresignedUrlRsp> {
  const body = { boardId, mimeType } as R.BgCoverPresignedUrlRqs;
  const rsp = await server.post(`${root}/bg-cover/presigned-url`, body);
  return rsp.data;
}

export async function getDefaultAvatarPresignedUrl(boardId: idT, mimeType: string): Promise<R.DefaultAvatarPresignedUrlRsp> {
  const body = { boardId, mimeType } as R.DefaultAvatarPresignedUrlRqs;
  const rsp = await server.post(`${root}/default-avatar/presigned-url`, body);
  return rsp.data;
}