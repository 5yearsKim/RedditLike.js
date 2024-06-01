import React from "react";
import { PostTab } from "./tabs/PostTab";
import { BoardTab } from "./tabs/BoardTab";

type SearchRouterProps = {
  tab: string;
  q: string;
};

export function SearchRouter(props: SearchRouterProps): JSX.Element {
  const { tab, q } = props;

  if (tab === "post") {
    return <PostTab q={q} />;
  }
  if (tab === "board") {
    return <BoardTab q={q} />;
  }
  return <div />;
}
