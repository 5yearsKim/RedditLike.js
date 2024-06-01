import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RestrictionPage } from "@/$pages/RestrictionPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.Restriction");
  return {
    title: t("title"),
  };
}

export default function Restriction(): JSX.Element {
  return (
    <RestrictionPage/>
  );
}
