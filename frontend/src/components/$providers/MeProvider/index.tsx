"use client";
import { useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { userTH } from "@/system/token_holders";
import { useUserActions } from "@/stores/UserStore";

type MeProviderProps = {
  children: ReactNode
}

export function MeProvider({ children }: MeProviderProps): ReactNode {
  const userAct = useUserActions();

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/configure-account") {
      return;
    }

    const tokenInfo = userTH.get();

    if (!tokenInfo) {
      userAct.set({ status: "loaded", data: { me: null, muter: null, admin: null } });
      userTH.reset();
    } else {
      // TODO:
      userAct.refresh();
    }

  }, []);


  return children;
}