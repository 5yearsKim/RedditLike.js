import { server } from "@/system/server";
import type * as R from "@/types/BoardUserBlock.api";
import type { BoardUserBlockFormT, ListBoardUserBlockOptionT } from "@/types";


const root = "/board-user-blocks";

export async function create(form: BoardUserBlockFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function list(listOpt: ListBoardUserBlockOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}
