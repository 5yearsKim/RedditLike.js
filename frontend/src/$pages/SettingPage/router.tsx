import React from "react";
import { BoardTab } from "./tabs/BoardTab";
// import { PostTab } from "./tabs/PostTab";
import { ChatTab } from "./tabs/ChatTab";
import { PageTab } from "./tabs/PageTab";
import { NotificationTab } from "./tabs/NotificationTab";

export function SearchRouter({ tab }: { tab: string }): JSX.Element {
  if (tab == "page") {
    return <PageTab />;
  }
  if (tab == "notification") {
    return <NotificationTab />;
  }
  if (tab === "board") {
    return <BoardTab />;
  }
  // if (tab === "post") {
  //   return <PostTab />;
  // }
  if (tab === "chat") {
    return <ChatTab />;
  }
  return <div />;
}
