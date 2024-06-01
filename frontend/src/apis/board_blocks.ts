import { server } from "@/system/server";
import * as R from "@/types/BoardBlock.api";
import type { BoardBlockFormT } from "@/types/BoardBlock";

const root = "/board-blocks";

export async function create(form: BoardBlockFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}