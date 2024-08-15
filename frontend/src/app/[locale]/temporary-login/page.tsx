import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TemporaryLoginPage } from "@/$pages/TemporaryLoginPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.TemporaryLogin");
  return {
    title: t("title"),
  };
}

export default function TemporaryLogin() {
  return (
    <TemporaryLoginPage/>
  );
}