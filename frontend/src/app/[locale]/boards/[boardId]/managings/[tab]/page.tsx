import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ManagingPage } from "@/$pages/ManagingPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.ManagingBoard");
  return {
    title: t("title"),
  };
}


export default function MainagingBoard(): JSX.Element {
  return (
    <ManagingPage />
  );
}
