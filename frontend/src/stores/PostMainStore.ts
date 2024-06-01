"use client";

import { atom, useRecoilValue } from "recoil";
import { useStoreActions, type StoreStateT } from "./molds/base";
import * as PostApi from "@/apis/posts";
import type { GetPostOptionT, PostT } from "@/types";


type PostMainStateDataT = {
  post: PostT
}

interface PostMainStateT extends StoreStateT<PostMainStateDataT> {}


const postMainState = atom<PostMainStateT>({
  key: "postMainState",
  default: {
    status: "init",
    data: undefined,
    lastUpdated: null,
  },
});


export function usePostMain$(): PostMainStateT {
  const post$ = useRecoilValue(postMainState);
  return post$;
}


export function usePostMainActions() {
  const {
    set,
    patch,
    load,
  } = useStoreActions({
    state: postMainState,
    loadFn: async ({ id }: {id: idT}) => {
      const getOpt: GetPostOptionT = {
        $defaults: true,
        $manager_defaults: true,
        $user_defaults: true,
        $board: true,
        $pin: true,
      };
      const { data: post } = await PostApi.get(id, getOpt);

      return {
        post,
      };
    },
    cacheCfg: {
      genKey: ({ id }: {id: idT}) => `post-${id}`,
      ttl: 1000 * 60 * 5, // 5 minutes
    },
  });

  function reset() {
    set({
      status: "init",
      data: undefined,
      lastUpdated: null,
    });
  }

  return {
    set,
    patch,
    load,
    reset,
  };
}