import { AtomEffect } from "recoil";

const lstore = typeof window !== "undefined" ? window.localStorage : null;

export function initFromStorage<T>(localKey: string, process: (val: string | null) => T): AtomEffect<T> {
  return ({ setSelf, trigger }): void => {
    if (!lstore) {
      return;
    }
    if (trigger == "get") {
      const cached = lstore.getItem(localKey);
      if (cached) {
        setSelf(process(cached));
      }
    }
  };
}
