"use client";

import { atom } from "recoil";
import { useSetRecoilState, useRecoilValue } from "recoil";
import type { ChatMessageFormT } from "@/types";


export type QueueItemT = {
  requestId: string;
  requestedAt: Date;
  roomId: idT;
  form: ChatMessageFormT;
};

type ChatQueueStateT = {
  sending: QueueItemT[];
  uploading: QueueItemT[];
  failed: QueueItemT[];
};

const chatQueueState = atom<ChatQueueStateT>({
  key: "chatQueueState",
  default: {
    sending: [],
    uploading: [],
    failed: [],
  },
});

type QueueTypeT = "sending" | "uploading" | "failed";


export function useChatQueue() {
  const chatQueue$ = useRecoilValue(chatQueueState);
  return chatQueue$;
}


export function useChatQueueActions() {
  const setState = useSetRecoilState(chatQueueState);

  function patch(data: Partial<ChatQueueStateT>): void {
    setState((state) => ({ ...state, ...data }));
  }

  function splice(type: QueueTypeT, at: number, cut: number, ...items: QueueItemT[]): void {
    setState((state) => {
      if (type == "sending") {
        const newList = [...state.sending];
        newList.splice(at, cut, ...items);
        return { ...state, sending: newList };
      }
      if (type == "failed") {
        const newList = [...state.failed];
        newList.splice(at, cut, ...items);
        return { ...state, failed: newList };
      }
      if (type == "uploading") {
        const newList = [...state.uploading];
        newList.splice(at, cut, ...items);
        return { ...state, uploading: newList };
      }
      return state;
    });
  }

  function filterItem(type: QueueTypeT, condition: (item: QueueItemT) => boolean): void {
    if (type == "sending") {
      setState((state) => ({
        ...state,
        sending: [...state.sending].filter(condition),
      }));
    } else if (type == "failed") {
      setState((state) => ({
        ...state,
        failed: [...state.failed].filter(condition),
      }));
    } else if (type == "uploading") {
      setState((state) => ({
        ...state,
        uploading: [...state.uploading].filter(condition),
      }));
    }
  }

  return {
    patch,
    splice,
    filterItem,
  };
}
