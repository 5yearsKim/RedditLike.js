import { server } from "@/system/server";
import * as R from "@/types/BoardUser.api";
import type { ListBoardUserOptionT, BoardUserFormT } from "@/types";

const root = "/board-users";

export async function getAuthor(boardId: idT): Promise<R.GetAuthorRsp> {
  const rsp = await server.get(`${root}/boards/${boardId}/author`);
  return rsp.data;
}

export async function create(form: BoardUserFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function list(listOpt: ListBoardUserOptionT): Promise<R.ListBoardUserRsp> {
  const params: ListBoardUserOptionT = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}


export async function checkNicknameUnique(boardId: idT, nickname: string): Promise<R.CheckNicknameUniqueRsp> {
  const rsp = await server.get(`${root}/boards/${boardId}/nickname-unique/${nickname}`);
  return rsp.data;
}

export async function getAvatarPresignedUrl(boardId: idT, mimeType: string): Promise<R.GetAvatarPresignedUrlRsp> {
  const body: R.GetAvatarPresignedUrlRqs = { boardId, mimeType };
  const rsp = await server.post(`${root}/avatar/presigned-url`, body);
  return rsp.data;
}