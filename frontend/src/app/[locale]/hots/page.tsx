import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HotPage } from "@/$pages/HotPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.Hot");
  return {
    title: t("title"),
  };
}

export default function Hot(): JSX.Element {
  return (
    <HotPage />
  );
}
