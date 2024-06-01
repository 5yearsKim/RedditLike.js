import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NotificationPage } from "@/$pages/NotificationPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.Notification");
  return {
    title: t("title"),
  };
}

export default function Notification() {
  return (
    <NotificationPage />
  );
}