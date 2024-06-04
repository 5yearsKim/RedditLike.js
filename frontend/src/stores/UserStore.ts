"use client";

import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { userTH } from "@/system/token_holders";
import * as AuthApi from "@/apis/auth";
import * as MuterApi from "@/apis/muters";
import * as AdminApi from "@/apis/admins";
import { UserT, UserSessionT, MuterT, AdminT } from "@/types";

type UserDataT = {
  me: UserT|null
  muter: MuterT|null
  admin: AdminT|null
}

type UserStateT = {
  status: ProcessStatusT
  data: UserDataT
}


export const userState = atom<UserStateT>({
  key: "userState",
  default: {
    status: "init",
    data: {
      me: null,
      muter: null,
      admin: null,
    },
  },
});


export function useUser$(): UserStateT {
  const user$ = useRecoilValue(userState);
  return user$;
}


export function useMe(): UserT|null {
  const user$ = useRecoilValue(userState);
  return user$.data?.me ?? null;
}

export function useMeAdmin(): AdminT|null {
  const user$ = useRecoilValue(userState);
  return user$.data?.admin ?? null;
}

export function useMeMuter(): MuterT|null {
  const user$ = useRecoilValue(userState);
  return user$.data?.muter ?? null;
}

export function useUserActions() {
  const set = useSetRecoilState(userState);

  function patch(val: Partial<UserStateT>) {
    set((prev) => ({ ...prev, ...val }));
  }

  function patchData(val: Partial<UserDataT>) {
    set((prev) => ({ ...prev, data: { ...prev.data, ...val } }));
  }

  function reset() {
    userTH.reset();
    set({
      status: "init",
      data: {
        me: null,
        muter: null,
        admin: null,
      },
    });
  }


  function loadFromSession(session: UserSessionT): void {
    const { token, tokenExpAt, user } = session;
    set({ status: "loaded", data: { me: user, admin: null, muter: null } });
    userTH.set({
      token: token,
      expiresAt: tokenExpAt,
      meta: { me: user },
    });
  }


  async function refresh(): Promise<void> {
    try {
      patch({ status: "loading" });
      const { user, token, tokenExpAt } = await AuthApi.refresh();
      // if (session == null) {
      //   set({ status: "loaded", data: { me: null, muter: null, admin: null } });
      //   userTH.reset();
      //   return;
      // }
      // const { user, token, tokenExpAt } = session;
      userTH.set({
        token: token,
        expiresAt: tokenExpAt,
        meta: { me: user },
      });
      set({ status: "loaded", data: { me: user, muter: null, admin: null } });
    } catch (e) {
      console.warn(e);
      set({ status: "error", data: { me: null, muter: null, admin: null } });
      userTH.reset();
    }
  }

  async function loadMuter(): Promise<void> {
    try {
      const { data: muter } = await MuterApi.getMe();
      patchData({ muter });
    } catch (e) {
      console.warn(e);
    }
  }

  async function loadAdmin(): Promise<void> {
    try {
      const { data: admin } = await AdminApi.getMe();
      patchData({ admin });
    } catch (e) {
      console.warn(e);
    }

  }


  return {
    set,
    patch,
    patchData,
    reset,
    refresh,
    loadFromSession,
    loadMuter,
    loadAdmin,
  };
}