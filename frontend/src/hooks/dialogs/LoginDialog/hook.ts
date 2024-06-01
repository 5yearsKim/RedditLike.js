"use client";

import { atom, useRecoilValue, useSetRecoilState } from "recoil";

type LoginDialogStateT = {
  open: boolean
}

export const loginDialogState = atom<LoginDialogStateT>({
  key: "loginDialogState",
  default: {
    open: false,
  },
});

export function useLoginDialogValue() {
  return useRecoilValue(loginDialogState);
}

export function useLoginDialog() {
  const set = useSetRecoilState(loginDialogState);

  function openLoginDialog() {
    set({ open: true });
  }

  function closeLoginDialog() {
    set({ open: false });
  }

  return {
    openLoginDialog,
    closeLoginDialog,
  };
}