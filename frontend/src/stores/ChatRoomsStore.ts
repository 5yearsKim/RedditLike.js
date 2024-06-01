"use client";

import { atom } from "recoil";
import { ListDataT, useListDataStore } from "./molds/list_data";
import * as ChatRoomApi from "@/apis/chat_rooms";
import type { ChatRoomT, ListChatRoomOptionT } from "@/types";

const chatRoomsState = atom<ListDataT<ChatRoomT, ListChatRoomOptionT>>({
  key: "chatRoomsStore",
  default: {
    status: "init",
    data: [],
    listArg: {} as ListChatRoomOptionT,
    appendingStatus: "init",
    nextCursor: null,
    lastUpdated: null,
  },
});

export function useChatRoomsStore() {
  return useListDataStore({
    listFn: ChatRoomApi.list,
    cacheCfg: {
      genKey: (arg) => `chatRooms-${JSON.stringify(arg)}`,
      ttl: 1000 * 60 * 10, // 10 minutes
    },
    recoilState: chatRoomsState,
  });
}

export const getListChatRoomOption = (opt: {userId?: idT}): ListChatRoomOptionT => ({
  userId: opt.userId,
  $board: true,
  $participants: true,
  $opponent: true,
  $last_message: true,
  $unread_cnt: true,
  public: "except",
  lastMessage: "only",
});
