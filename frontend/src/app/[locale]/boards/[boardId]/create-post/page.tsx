import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CreatePostPage } from "@/$pages/CreatePostPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.CreatePost");
  return {
    title: t("title"),
  };
}


export default function CreatePost(): JSX.Element {
  return (
    <CreatePostPage />
  );
}
