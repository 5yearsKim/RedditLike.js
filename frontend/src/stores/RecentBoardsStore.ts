"use client";

import { useEffect } from "react";
import { atom , useRecoilState } from "recoil";
import { useRecentVisitActions, type RecentVisitStateT } from "./molds/recent_visit";
import { useGroup } from "@/stores/GroupStore";
import type { BoardT } from "@/types/Board";


const recentBoardsState = atom<RecentVisitStateT<BoardT>>({
  key: "recentBoardsState",
  default: {
    status: "init",
    data: [],
    meta: {},
  },
});


export function useRecentBoards(): RecentVisitStateT<BoardT> {
  const group = useGroup();
  const storageKey = "recentBoards_" + group.key;

  const [recentBoards$, set ] = useRecoilState(recentBoardsState);

  useEffect(() => {
    if (recentBoards$.status == "init") {
      initFromStorage();
    }
    if (recentBoards$.meta.groupId !== group.id) {
      initFromStorage();
    }
  }, [group.id]);

  function initFromStorage() {
    const recentBoards = localStorage.getItem(storageKey);
    if (!recentBoards) {
      set({ data: [], status: "loaded", meta: { groupId: group.id } });
      return;
    }
    try {
      const parsed = JSON.parse(recentBoards);
      if (Array.isArray(parsed)) {
        set({ data: parsed, status: "loaded", meta: { groupId: group.id } });
      } else {
        throw new Error("invalid recentBoards with " + parsed);
      }
    } catch (e) {
      console.warn(e);
      localStorage.removeItem(storageKey);
    }
  }

  return recentBoards$;

}

export function useRecentBoardsActions() {
  const group = useGroup();
  const storageKey = "recentBoards_" + group.key;

  return useRecentVisitActions({
    recoilState: recentBoardsState,
    maxItems: 3,
    onDataChange: (data) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (e) {
        console.warn(e);
        localStorage.removeItem(storageKey);
      }
    },
  });

}