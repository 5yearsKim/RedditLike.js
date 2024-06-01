import { server } from "@/system/server";
import * as R from "@/types/BoardManager.api";
import type { BoardManagerFormT, ListBoardManagerOptionT, GetBoardManagerOptionT } from "@/types/BoardManager";

const root = "/board-managers";

export async function getMe(boardId: idT): Promise<R.GetMeRsp> {
  const rsp = await server.get(`${root}/boards/${boardId}/me`);
  return rsp.data;
}

export async function get(id: idT, getOpt: GetBoardManagerOptionT): Promise<R.GetRsp> {
  const params = getOpt satisfies R.GetRqs;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

export async function create(form: BoardManagerFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(id: idT, form: Partial<BoardManagerFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function list(listOpt: ListBoardManagerOptionT): Promise<R.ListRsp> {
  const params = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}


