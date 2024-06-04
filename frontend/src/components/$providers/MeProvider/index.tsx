"use client";
import { useEffect, ReactNode } from "react";
import { userTH } from "@/system/token_holders";
import { useMe, useUserActions } from "@/stores/UserStore";

type MeProviderProps = {
  children: ReactNode
}

export function MeProvider({ children }: MeProviderProps): ReactNode {
  const me = useMe();
  const userAct = useUserActions();

  useEffect(() => {
    const tokenInfo = userTH.get();

    if (!tokenInfo) {
      userAct.set({ status: "loaded", data: { me: null, muter: null, admin: null } });
      userTH.reset();
    } else {
      // TODO:
      userAct.refresh();
    }

  }, []);

  // check if i'm muter or admin
  useEffect(() => {
    if (me?.id) {
      userAct.loadAdmin();
      userAct.loadMuter();
    }
  }, [me?.id]);


  return children;
}