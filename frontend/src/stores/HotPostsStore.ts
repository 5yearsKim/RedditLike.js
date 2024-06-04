"use client";

import { atom } from "recoil";
import { ListDataT, useListDataStore } from "./molds/list_data";
import * as PostApi from "@/apis/posts";
import type { PostT, ListPostOptionT } from "@/types";
import { startOfHour, subDays } from "date-fns";

const hotPostsState = atom<ListDataT<PostT, ListPostOptionT>>({
  key: "hotPostsState",
  default: {
    status: "init",
    data: [],
    listArg: {} as ListPostOptionT,
    appendingStatus: "init",
    nextCursor: null,
    lastUpdated: null,
  },
});

export function useHotPostsStore() {
  return useListDataStore({
    listFn: PostApi.list,
    cacheCfg: {
      genKey: (arg) => `hot-posts-${JSON.stringify(arg)}`,
      ttl: 1000 * 60 * 10, // 10 minutes
    },
    recoilState: hotPostsState,
  });
}

export const getHotPostsListOpt = ({ userId }: { userId?: idT }): ListPostOptionT => {

  const yesterday = startOfHour(subDays(new Date(), 1));
  return {
    userId,
    limit: 10,
    sort: "vote",
    fromAt: yesterday,
    censor: "exceptTrashed",
    block: "except",
  };
};
