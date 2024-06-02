"use client";

import { atom } from "recoil";
import { ListDataT, useListDataStore } from "./molds/list_data";
import * as BoardApi from "@/apis/boards";
import type { BoardT, ListBoardOptionT } from "@/types";

const hotBoardsState = atom<ListDataT<BoardT, ListBoardOptionT>>({
  key: "hotBoardsState",
  default: {
    status: "init",
    data: [],
    listArg: {} as ListBoardOptionT,
    appendingStatus: "init",
    nextCursor: null,
    lastUpdated: null,
  },
});

export function useHotBoardsStore() {
  return useListDataStore({
    listFn: BoardApi.list,
    cacheCfg: {
      genKey: (arg) => `hot-boards-${JSON.stringify(arg)}`,
      ttl: 1000 * 60 * 10, // 10 minutes
    },
    recoilState: hotBoardsState,
  });
}

export const getHotBoardsListOpt = ({ userId }: { userId?: idT }): ListBoardOptionT => {
  return {
    userId,
    block: "except",
    censor: "exceptTrashed",
    sort: "hot",
    limit: 7,
  };
};
