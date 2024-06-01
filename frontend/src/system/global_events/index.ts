import { GlobalEvent } from "./global_event";
import type {
  BoardT, PostT, CommentT,
} from "@/types";

export const updateBoardEv = new GlobalEvent<BoardT>();
export const updatePostEv = new GlobalEvent<PostT>();
export const updateCommentEv = new GlobalEvent<CommentT>();
export const refreshChatRoomsEv = new GlobalEvent<"block" | "init" | "leave">();

// sockets
import {
  ReceiveMessageArgT,
  Room$GetClientNumArgT,
  Room$ReceiveMessageArgT,
  Room$UpdateArgT,
} from "@/types/Chat.socket";

export const receiveMessageEv = new GlobalEvent<ReceiveMessageArgT>();
export const room$receiveMessageEv = new GlobalEvent<Room$ReceiveMessageArgT>();
export const room$updateEv = new GlobalEvent<Room$UpdateArgT>();
export const room$getClientNumEv = new GlobalEvent<Room$GetClientNumArgT>();

import { ReceiveNotificationArgT } from "@/types/Notification.socket";

export const receiveNotificationEv = new GlobalEvent<ReceiveNotificationArgT>();
