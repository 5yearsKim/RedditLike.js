import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WithdrawCompletePage } from "@/$pages/WithdrawCompletePage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.WithdrawComplete");
  return {
    title: t("title"),
    icons: "/icons/nonimos/favicon.ico",
  };
}

export default function WithdrawComplete(): JSX.Element {
  return <WithdrawCompletePage />;
}
