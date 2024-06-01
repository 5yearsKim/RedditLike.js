import React from "react";
import { useTranslations } from "next-intl";
import { ErrorBox } from "@/components/$statusTools";
import { PostTab } from "./tabs/PostTab";
import { CommentTab } from "./tabs/CommentTab";
import { BoardTab } from "./tabs/BoardTab";
import { BookmarkTab } from "./tabs/BookmarkTab";
import type { UserT } from "@/types";

export function ActivityRouter({ tab, me }: { tab: string; me: UserT }): JSX.Element {
  const t = useTranslations("pages.ActivityPage");

  if (tab === "post") {
    return <PostTab me={me} />;
  }
  if (tab === "comment") {
    return <CommentTab me={me} />;
  }
  if (tab === "board") {
    return <BoardTab />;
  }
  if (tab === "bookmark") {
    return <BookmarkTab me={me} />;
  }
  return <ErrorBox message={t("cannotAccessTab", { tab })} />;
}
