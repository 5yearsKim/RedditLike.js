"use client";

import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { userTH } from "@/system/token_holders";
import * as UserApi from "@/apis/users";
import * as GroupMuterApi from "@/apis/group_muters";
import * as GroupAdminApi from "@/apis/group_admins";
import { UserT, UserSessionT, GroupMuterT, GroupAdminT } from "@/types";

type UserDataT = {
  me: UserT|null
  muter: GroupMuterT|null
  admin: GroupAdminT|null
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

export function useMeAdmin(): GroupAdminT|null {
  const user$ = useRecoilValue(userState);
  return user$.data?.admin ?? null;
}

export function useMeMuter(): GroupMuterT|null {
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
    userTH.set({
      token: token,
      expiresAt: tokenExpAt,
      meta: { me: user },
    });
  }

  async function access(groupId: idT): Promise<void> {
    try {
      patch({ status: "loading" });
      const { session } = await UserApi.access(groupId);
      if (session == null) {
        set({ status: "loaded", data: { me: null, muter: null, admin: null } });
        userTH.reset();
        return;
      }
      const { user, token, tokenExpAt } = session;
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

  async function loadMuter(groupId: idT): Promise<void> {
    try {
      const { data: muter } = await GroupMuterApi.getMe(groupId);
      patchData({ muter });
    } catch (e) {
      console.warn(e);
    }
  }

  async function loadAdmin(groupId: idT): Promise<void> {
    try {
      const { data: admin } = await GroupAdminApi.getMe(groupId);
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
    access,
    loadFromSession,
    loadMuter,
    loadAdmin,
  };
}