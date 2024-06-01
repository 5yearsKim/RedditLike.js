import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/$pages/AdminPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.Admin");
  return {
    title: t("title"),
  };
}

export default function Admin(): JSX.Element {
  return (
    <AdminPage />
  );
}
