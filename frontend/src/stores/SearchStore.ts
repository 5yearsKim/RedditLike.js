"use client";

import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import type { BoardT } from "@/types/Board";

type SearchStateT = {
  query: string;
  searchBoard: BoardT | null;
  isSearchFocused: boolean;
};

const searchState = atom<SearchStateT>({
  key: "searchState",
  default: {
    query: "",
    searchBoard: null,
    isSearchFocused: false,
  },
});

export function useSearch$() {
  const search$ = useRecoilValue(searchState);
  return search$;
}

export function useSearchActions() {
  const set = useSetRecoilState(searchState);

  function patch(data: Partial<SearchStateT>): void {
    set((state) => ({
      ...state,
      ...data,
    }));
  }

  return {
    patch,
  };
}
