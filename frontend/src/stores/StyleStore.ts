"use client";

import { atom, useRecoilValue, useSetRecoilState } from "recoil";

type StyleStateT = {
  isDark?: boolean;
};

const styleState = atom<StyleStateT>({
  key: "styleState",
  default: {},
});


export function useStyle$() {
  const style$ = useRecoilValue(styleState);
  return style$;
}

export function useStyleActions() {
  const setStyle = useSetRecoilState(styleState);

  function patch(data: Partial<StyleStateT>): void {
    setStyle((state) => ({ ...state, ...data }));
  }

  return {
    patch,
  };
}
