import { server } from "@/system/server";
import * as R from "@/types/ChatMessage.api";
import { ListChatMessageOptionT } from "@/types/ChatMessage";


const root = "/chat-messages";

export async function list(listOpt: ListChatMessageOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}
