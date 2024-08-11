import { server } from "@/system/server";
import * as R from "@/types/BoardRule.api";
import { BoardRuleFormT, ListBoardRuleOptionT } from "@/types";

const root = "/board-rules";

export async function create(form: BoardRuleFormT): Promise<R.CreateRsp> {
  const body = { form } as R.CreateRqs;
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function list(listOpt: ListBoardRuleOptionT): Promise<R.ListRsp> {
  const params = listOpt as R.ListRqs;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function update(id: idT, form: Partial<BoardRuleFormT>): Promise<R.UpdateRsp> {
  const body = { form } as R.UpdateRqs;
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function rerank(boardId: idT, ruleIds: idT[]): Promise<R.RerankRsp> {
  const body = { boardId, ruleIds } as R.RerankRqs;
  const rsp = await server.put(`${root}/rerank`, body);
  return rsp.data;
}


