"use client";

import { atom } from "recoil";
import { useListDataStore, ListDataT } from "./molds/list_data";
import * as BoardApi from "@/apis/boards";
import type { BoardT, ListBoardOptionT } from "@/types";

const managingBoardsState = atom<ListDataT<BoardT, ListBoardOptionT>>({
  key: "managingBoardsState",
  default: {
    status: "init",
    listArg: {} as ListBoardOptionT,
    data: [],
    appendingStatus: "init",
    nextCursor: null,
    lastUpdated: null,
  },
});

// eslint-disable-next-line
export function useManagingBoardsStore() {
  return useListDataStore({
    listFn: BoardApi.list,
    cacheCfg: {
      genKey: (arg) => `managing-boards-${JSON.stringify(arg)}` ,
      ttl: 1000 * 60 * 10, // 10 minutes
    },
    recoilState: managingBoardsState,
  });
}

export const getManagingBoardsListOpt = ({ userId }: { userId?: idT }): ListBoardOptionT => {
  return {
    userId,
    managing: "only",
    block: "except",
    censor: "exceptTrashed",
  };
};
