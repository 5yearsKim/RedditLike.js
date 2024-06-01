import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountPage } from "@/$pages/AccountPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.Account");
  return {
    title: t("title"),
  };
}

export default function Account(): JSX.Element {
  return (
    <AccountPage />
  );
}
