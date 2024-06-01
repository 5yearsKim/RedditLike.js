import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EmailLoginPage } from "@/$pages/EmailLoginPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.EmailLogin");
  return {
    title: t("title"),
  };
}

export default function EmailLogin() {
  return (
    <EmailLoginPage />
  );
}