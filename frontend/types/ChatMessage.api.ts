import { ChatMessageT, ListChatMessageOptionT } from "./ChatMessage";

// (GET) /
export type ListRqs = ListChatMessageOptionT
export type ListRsp = ListData<ChatMessageT>