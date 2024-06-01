import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BoardListPage } from "@/$pages/BoardListPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.Boards");
  return {
    title: t("title"),
  };
}

export default function Boards() {
  return (
    <BoardListPage/>
  );
}