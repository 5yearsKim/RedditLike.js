import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ActivityPage } from "@/$pages/ActivityPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.Activity");
  return {
    title: t("title"),
  };
}

export default function Activity(): JSX.Element {
  return (
    <ActivityPage />
  );
}
