"use client";

import { atom, useSetRecoilState } from "recoil";
import type { AuthorT } from "@/types";

type BlockAuthorDialogStateT = {
  isOpen: boolean;
  author: AuthorT;
  type: "board" | "group";
  until?: Date;
  reason: string;
};

export const blockAuthorDialogState = atom<BlockAuthorDialogStateT>({
  key: "blockAuthorDialogState",
  default: {
    isOpen: false,
    author: {} as any,
    type: "board",
    until: undefined,
    reason: "",
  },
});

export function useBlockAuthorDialog() {
  const setState = useSetRecoilState(blockAuthorDialogState);

  function openBlockAuthorDialog(
    type: "board" | "group",
    author: AuthorT,
    option: { until?: Date; reason: string } = { reason: "" },
  ): void {
    setState({
      isOpen: true,
      author,
      type,
      until: option.until,
      reason: option.reason,
    });
  }

  function closeBlockAutorDialog(): void {
    setState((state) => ({
      ...state,
      isOpen: false,
    }));
  }

  return {
    openBlockAuthorDialog,
    closeBlockAutorDialog,
  };
}
