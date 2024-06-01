import { server } from "@/system/server";
import * as R from "@/types/BoardMuter.api";
import type { BoardMuterFormT, GetBoardMuterOptionT, ListBoardMuterOptionT } from "@/types/BoardMuter";

const root = "/board-muters";

export async function get(id: idT, getOpt: GetBoardMuterOptionT = {}): Promise<R.GetRsp> {
  const params = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

export async function create(form: BoardMuterFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(id: idT, form: Partial<BoardMuterFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function list(listOpt: ListBoardMuterOptionT) {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}


