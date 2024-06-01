import { chatMessageM, ChatMessageSqls } from "@/models/ChatMessage";
import type { GetChatMessageOptionT } from "@/types";


export function lookupBuilder(select: any[], opt: GetChatMessageOptionT) {
  const sqls = new ChatMessageSqls(chatMessageM.table);

  // sender
  if (opt.$sender) {
    select.push(sqls.sender());
  }

}