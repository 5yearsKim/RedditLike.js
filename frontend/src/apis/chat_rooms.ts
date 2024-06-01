import { server } from "@/system/server";
import * as R from "@/types/ChatRoom.api";
import { ListChatRoomOptionT, GetChatRoomOptionT, ChatRoomFormT } from "@/types/ChatRoom";

const root = "/chat-rooms";


export async function create(form: ChatRoomFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function list(listOpt: ListChatRoomOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function init(boardId: idT, opponentId: idT): Promise<R.InitRsp> {
  const body: R.InitRqs = { boardId, opponentId };
  const rsp = await server.post(`${root}/init`, body);
  return rsp.data;
}

export async function initBoard(boardId: idT): Promise<R.InitBoardRsp> {
  const body: R.InitBoardRqs = { boardId };
  const rsp = await server.post(`${root}/init-board`, body);
  return rsp.data;
}

export async function get(id: idT, getOpt: GetChatRoomOptionT = {}): Promise<R.GetRsp> {
  const params: R.GetRqs = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

export async function leaveChat(id: idT): Promise<R.LeaveRsp> {
  const rsp = await server.patch(`${root}/${id}/leave`);
  return rsp.data;
}