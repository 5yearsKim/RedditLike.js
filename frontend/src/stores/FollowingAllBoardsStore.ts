"use client";

import { atom } from "recoil";
import { ListDataT, useListDataStore } from "./molds/list_data";
import * as BoardApi from "@/apis/boards";
import type { BoardT, ListBoardOptionT } from "@/types";

const followingAllBoardsState = atom<ListDataT<BoardT, ListBoardOptionT>>({
  key: "followingAllBoardsState",
  default: {
    status: "init",
    data: [],
    listArg: {} as ListBoardOptionT,
    appendingStatus: "init",
    nextCursor: null,
    lastUpdated: null,
  },
});

export function useFollowingAllBoardsStore() {
  return useListDataStore({
    listFn: BoardApi.list,
    cacheCfg: {
      genKey: (arg) => `following-all-boards-${JSON.stringify(arg)}`,
      ttl: 1000 * 60 * 10, // 10 minutes
    },
    recoilState: followingAllBoardsState,
  });
}

export const getFollowingAllBoardsListOpt = ({ userId, groupId }: { userId?: idT, groupId: idT }): ListBoardOptionT => {
  return {
    userId,
    groupId,
    $user_defaults: true,
    block: "except",
    censor: "exceptTrashed",
    sort: "recently_followed",
    limit: 50,
  };
};
