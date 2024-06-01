import { DataModel } from "@/utils/orm";
import type { ChatUserFormT, ChatUserT } from "@/types/ChatUser";


const table = "chat_users";
export const chatUserM = new DataModel<ChatUserFormT, ChatUserT>(table);


