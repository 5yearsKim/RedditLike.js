"use client";

import { atom , useRecoilState } from "recoil";
import { useEffect } from "react";
import { useRecentVisitActions, type RecentVisitStateT } from "./molds/recent_visit";
import { useGroup } from "@/stores/GroupStore";
import type { PostT } from "@/types/Post";


const recentPostsState = atom<RecentVisitStateT<PostT>>({
  key: "recentPostsState",
  default: {
    status: "init",
    data: [],
    meta: {},
  },
});

export function useRecentPosts(): RecentVisitStateT<PostT> {

  const group = useGroup();
  const storageKey = "recentPosts_" + group.key;

  const [recentPosts$, set ] = useRecoilState(recentPostsState);

  useEffect(() => {
    if (recentPosts$.status == "init") {
      initFromStorage();
    }
    if (recentPosts$.meta.groupId !== group.id) {
      initFromStorage();
    }
  }, [group.id]);

  function initFromStorage() {
    const recentPosts = localStorage.getItem(storageKey);
    if (!recentPosts) {
      set({ data: [], status: "loaded", meta: { groupId: group.id } });
      return;
    }
    try {
      const parsed = JSON.parse(recentPosts);
      if (Array.isArray(parsed)) {
        set({ data: parsed, status: "loaded", meta: { groupId: group.id } });
      } else {
        throw new Error("invalid recentPosts with " + parsed);
      }
    } catch (e) {
      console.warn(e);
      localStorage.removeItem(storageKey);
    }
  }


  return recentPosts$;
}

export function useRecentPostsActions() {
  const group = useGroup();
  const storageKey = "recentPosts_" + group.key;
  return useRecentVisitActions({
    recoilState: recentPostsState,
    maxItems: 5,
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