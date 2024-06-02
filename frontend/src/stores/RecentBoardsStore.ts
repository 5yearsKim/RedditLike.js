"use client";

import { useEffect } from "react";
import { atom , useRecoilState } from "recoil";
import { useRecentVisitActions, type RecentVisitStateT } from "./molds/recent_visit";
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
  const storageKey = "recentBoards";

  const [recentBoards$, set ] = useRecoilState(recentBoardsState);

  useEffect(() => {
    if (recentBoards$.status == "init") {
      initFromStorage();
    }
  }, []);

  function initFromStorage() {
    const recentBoards = localStorage.getItem(storageKey);
    if (!recentBoards) {
      set({ data: [], status: "loaded", meta: { } });
      return;
    }
    try {
      const parsed = JSON.parse(recentBoards);
      if (Array.isArray(parsed)) {
        set({ data: parsed, status: "loaded", meta: { } });
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
  const storageKey = "recentBoards";

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