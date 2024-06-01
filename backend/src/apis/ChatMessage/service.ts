import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { listChatMessage } from "./fncs/list_chat_message";
import type { ChatMessageT, ListChatMessageOptionT } from "@/types";


@Injectable()
export class ChatMessageService {
  constructor() {}

  async list(listOpt: ListChatMessageOptionT): Promise<ListData<ChatMessageT>> {
    return await listChatMessage(listOpt);
  }
}