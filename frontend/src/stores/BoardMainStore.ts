"use client";

import { atom, useRecoilValue } from "recoil";
import { useStoreActions, type StoreStateT } from "./molds/base";
import * as BoardApi from "@/apis/boards";
import * as BoardManagerApi from "@/apis/board_managers";
import * as BoardUserApi from "@/apis/board_users";
import * as FlagApi from "@/apis/flags";
import * as BoardRuleApi from "@/apis/board_rules";
import type {
  BoardT, GetBoardOptionT, AuthorT, BoardManagerT,
  FlagT, BoardRuleT,
} from "@/types";


type BoardMainStateDataT = {
  board: BoardT
  manager: BoardManagerT|null
  author: AuthorT|null
  flags: FlagT[]
  rules: BoardRuleT[]
}

interface BoardMainStateT extends StoreStateT<BoardMainStateDataT> {}

const boardMainState = atom<BoardMainStateT>({
  key: "boardMainState",
  default: {
    status: "init",
    data: undefined,
    lastUpdated: null,
  },
});

export function useBoardMain$(): BoardMainStateT {
  const board$ = useRecoilValue(boardMainState);
  return board$;
}


export function useBoardMainActions() {
  const {
    set,
    patch,
    patchData,
    load,
  } = useStoreActions({
    state: boardMainState,
    loadFn: async ({ id, userId }: {id: idT, userId?: idT}) => {

      const getOpt: GetBoardOptionT = {
        userId: userId,
        $user_defaults: true,
      };
      const [
        { data: board },
        { data: manager },
        { data: author },
        { data: flags },
        { data: rules },
      ] = await Promise.all([
        BoardApi.get(id, getOpt),
        BoardManagerApi.getMe(id),
        BoardUserApi.getAuthor(id),
        FlagApi.list({ boardId: id }),
        BoardRuleApi.list({ boardId: id }),
      ]);
      BoardApi.get(id, getOpt);
      return {
        board,
        manager,
        author,
        flags,
        rules,
      };
    },
    cacheCfg: {
      genKey: ({ id }: {id: idT}) => `board-${id}`,
      ttl: 1000 * 60 * 5, // 5 minutes
    },
  });

  return {
    set,
    patch,
    patchData,
    load,
  };
}