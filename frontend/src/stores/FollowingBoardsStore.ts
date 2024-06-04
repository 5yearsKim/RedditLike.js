"use client";

import { atom } from "recoil";
import { ListDataT, useListDataStore } from "./molds/list_data";
import * as BoardApi from "@/apis/boards";
import type { BoardT, ListBoardOptionT } from "@/types";

const followingBoardsState = atom<ListDataT<BoardT, ListBoardOptionT>>({
  key: "followingBoardsState",
  default: {
    status: "init",
    data: [],
    listArg: {} as ListBoardOptionT,
    appendingStatus: "init",
    nextCursor: null,
    lastUpdated: null,
  },
});

export function useFollowingBoardsStore() {
  return useListDataStore({
    listFn: BoardApi.list,
    cacheCfg: {
      genKey: (arg) => `following-boards-${JSON.stringify(arg)}`,
      ttl: 1000 * 60 * 10, // 10 minutes
    },
    recoilState: followingBoardsState,
  });
}

export const getFollowingBoardsListOpt = ({ userId }: { userId?: idT }): ListBoardOptionT => {
  return {
    userId,
    following: "only",
    block: "except",
    censor: "exceptTrashed",
    sort: "recently_followed",
    limit: 200,
  };
};
