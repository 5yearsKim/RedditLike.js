"use client";

import { atom } from "recoil";
import type { ListBoardOptionT, BoardT } from "@/types/Board";
import { useListDataStore, type ListDataT } from "./molds/list_data";
import * as BoardApi from "@/apis/boards";

const allBoardsState = atom<ListDataT<BoardT, ListBoardOptionT >>({
  key: "allBoardsState",
  default: {
    status: "init",
    listArg: {} as ListBoardOptionT,
    data: [],
    nextCursor: null,
    appendingStatus: "init",
    lastUpdated: null,
    lastKey: undefined,
  },
});

export function useAllBoardsStore() {
  return useListDataStore({
    listFn: BoardApi.list,
    cacheCfg: {
      genKey: (arg) => `all-boards-${JSON.stringify(arg)}`,
      ttl: 1000 * 60 * 5, // 5 minutes
    },
    recoilState: allBoardsState,
  });
}
