import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SettingPage } from "@/$pages/SettingPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.Setting");
  return {
    title: t("title"),
  };
}

export default function Setting(): JSX.Element {
  return (
    <SettingPage />
  );
}
