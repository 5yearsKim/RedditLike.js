"use client";

import React, { ReactNode } from "react";
import { RecoilRoot } from "recoil";

type RecoilProviderProps = {
  children: ReactNode;
}

export function RecoilProvider({ children }: RecoilProviderProps): ReactNode {
  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  );
}

