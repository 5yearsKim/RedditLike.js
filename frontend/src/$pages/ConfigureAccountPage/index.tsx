"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingBox, ErrorBox } from "@/components/$statusTools";
import { useAccountActions } from "@/stores/AccountStore";
import * as AuthApi from "@/apis/auth";
import type { AccountT } from "@/types";


export function ConfigureAccountPage() {
  const t = useTranslations("pages.ConfigureAccountPage");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<ProcessStatusT>("init");
  const [loadedAccount, setLoadedAccount] = useState<AccountT|undefined>(undefined);
  const accountAct = useAccountActions();


  useEffect(() => {
    init();
  }, []);

  async function init(): Promise<void> {
    const accountToken = searchParams.get("accountToken");
    const redirect = searchParams.get("redirect");
    if (!accountToken) {
      setStatus("error");
      console.warn("accountToken is not provided");
      return;
    }
    try {
      setStatus("loading");
      const session = await AuthApi.verifyAccountToken(accountToken);
      accountAct.loadFromSession(session);

      router.replace(redirect || "/");
      setStatus("loaded");
      setLoadedAccount(session.account);
    } catch (e) {
      setStatus("error");
      console.warn(e);
    }
  }

  if (status == "error") {
    return <ErrorBox height='80vh' message={t("loadingFailed")} showHome/>;
  }

  if (status == "loaded") {
    return <LoadingBox height="80vh" message={t("loadingComplete", { email: loadedAccount?.email ?? "account" })}/>;
  }

  return <LoadingBox height="80vh" message={t("loadingAccount")}/>;
}