"use client";

import { atom } from "recoil";
import type { ListCategoryOptionT, CategoryT } from "@/types/Category";
import { useListDataStore } from "./molds/list_data";
import type { ListDataT } from "@/hooks/ListData/type";
import * as CategoryApi from "@/apis/categories";

const categoriesState = atom<ListDataT<CategoryT, ListCategoryOptionT>>({
  key: "categoryState",
  default: {
    status: "init",
    listArg: {} as ListCategoryOptionT,
    data: [],
    nextCursor: null,
    appendingStatus: "init",
    lastUpdated: null,
    lastKey: undefined,
  },
});

export function useCategoriesStore() {
  return useListDataStore({
    listFn: CategoryApi.list,
    cacheCfg: {
      genKey: (arg) => `categories-${JSON.stringify(arg)}`,
      ttl: 1000 * 60 * 5, // 5 minutes
    },
    recoilState: categoriesState,
  });
}

export function getCategoriesListOpt(config: {userId?: idT, groupId: idT, boardId?: idT}): ListCategoryOptionT {
  const { userId, boardId, groupId } = config;
  return {
    userId,
    boardId,
    groupId,
    $my_like: true,
  };
}