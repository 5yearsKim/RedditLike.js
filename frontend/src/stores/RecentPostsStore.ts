"use client";

import { atom , useRecoilState } from "recoil";
import { useEffect } from "react";
import { useRecentVisitActions, type RecentVisitStateT } from "./molds/recent_visit";
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
  const storageKey = "recentPosts";

  const [recentPosts$, set ] = useRecoilState(recentPostsState);

  useEffect(() => {
    if (recentPosts$.status == "init") {
      initFromStorage();
    }
  }, []);

  function initFromStorage() {
    const recentPosts = localStorage.getItem(storageKey);
    if (!recentPosts) {
      set({ data: [], status: "loaded", meta: { } });
      return;
    }
    try {
      const parsed = JSON.parse(recentPosts);
      if (Array.isArray(parsed)) {
        set({ data: parsed, status: "loaded", meta: { } });
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
  const storageKey = "recentPosts";
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