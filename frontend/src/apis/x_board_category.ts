import { server } from "@/system/server";
import * as R from "@/types/XBoardCategory.api";

const root = "/x-board-category";

export async function link(boardId: idT, categoryIds: idT[]): Promise<R.LinkRsp> {
  const body: R.LinkRqs = { boardId, categoryIds };
  const rsp = await server.post(`${root}/link`, body);
  return rsp.data;
}