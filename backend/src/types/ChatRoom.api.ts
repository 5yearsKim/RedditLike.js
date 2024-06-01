import { ChatRoomFormT, ChatRoomT, ListChatRoomOptionT, GetChatRoomOptionT } from "./ChatRoom";

// (POST) /
export type CreateRqs = { form: ChatRoomFormT }
export type CreateRsp = ChatRoomFormT


// (GET) /
export type ListRqs = ListChatRoomOptionT
export type ListRsp = ListData<ChatRoomT>


//  (POST) /init
export type InitRqs = {boardId: idT, opponentId: idT}
export type InitRsp = ChatRoomT

// (POST) /init-board
export type InitBoardRqs = {boardId: idT}
export type InitBoardRsp = ChatRoomFormT


// (GET) /:id
export type GetRqs = GetChatRoomOptionT
export type GetRsp = GetData<ChatRoomT>

// (PATCH) /:id/leave
export type LeaveRqs = null
export type LeaveRsp = null