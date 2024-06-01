import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CreateBoardPage } from "@/$pages/CreateBoardPage";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.CreateBoard");
  return {
    title: t("title"),
  };
}

export default function CreateBoard() {
  return (
    <CreateBoardPage/>
  );
}