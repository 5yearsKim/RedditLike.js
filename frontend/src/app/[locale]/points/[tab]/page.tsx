import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PointPage } from "@/$pages/PointPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.Point");
  return {
    title: t("title"),
  };
}

export default function Points() {
  return (
    <PointPage />
  );
}