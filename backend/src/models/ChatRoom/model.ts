import { DataModel } from "@/utils/orm";
import type { ChatRoomFormT, ChatRoomT } from "@/types/ChatRoom";


const table = "chat_rooms";
export const chatRoomM = new DataModel<ChatRoomFormT, ChatRoomT>(table);


