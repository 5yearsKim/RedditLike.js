import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SearchPage } from "@/$pages/SearchPage";

type MetadataProps = {
  params: { tab: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { searchParams }: MetadataProps,
): Promise<Metadata> {
  const t = await getTranslations("app.Search");
  return {
    title: t("title", { q: searchParams.q?.toString() }),
  };
}


export default function Search(): JSX.Element {
  return (
    <SearchPage />
  );
}
