import { DataModel } from "@/utils/orm";
import type { ChatMessageT, ChatMessageFormT } from "@/types/ChatMessage";


const table = "chat_messages";
export const chatMessageM = new DataModel<ChatMessageFormT, ChatMessageT>(table);


