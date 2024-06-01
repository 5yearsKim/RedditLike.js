import { server } from "@/system/server";
import * as R from "@/types/XBoardUserFlair.api";


const root = "/x-board-user-flair";

export async function linkMe(boardId: idT, flairIds: idT[]): Promise<R.LinkMeRsp> {
  const body: R.LinkMeRqs = { boardId, flairIds };
  const rsp = await server.post(`${root}/link-me`, body);
  return rsp.data;
}
