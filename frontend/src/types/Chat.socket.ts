import type { ChatMessageFormT, ChatMessageT } from "./ChatMessage";
import type { ChatRoomT } from "./ChatRoom";

// listen
export type SendMessageArgT = {requestId: string, form: ChatMessageFormT}

// emit
export type ReceiveMessageArgT = {requestId: string, message: ChatMessageT, chatRoom: ChatRoomT}

// emit
export type Room$ReceiveMessageArgT = {requestId: string, message: ChatMessageT, chatRoom: ChatRoomT}

// listen
export type Room$WatchArgT = {chatRoom: ChatRoomT}
export type Room$UnwatchArgT = {chatRoom: ChatRoomT}
export type Room$CheckArgT = {chatRoom: ChatRoomT}

// emit
export type Room$UpdateArgT = {chatRoom: ChatRoomT}
export type Room$GetClientNumArgT = {chatRoom: ChatRoomT, clientNum: number}