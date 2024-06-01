"use client";
import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Divider } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { Gap, Row, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { DarkModeSelector } from "@/components/DarkModeSelector";
import { LocaleSelector } from "@/components/LocaleSelector";
import { DefaultSortSelector } from "../../items/DefaultSortSelector";
// logic
import { useState, useEffect } from "react";
import { PostSortT, BoardSortT, CommentSortT } from "@/types";


export function PageTab(): ReactNode {
  const t = useTranslations("pages.SettingPage.PageTab");

  const [feedSort, setFeedSort] = useState<PostSortT>("hot");
  const [boardSort, setBoardSort] = useState<BoardSortT>("hot");
  const [boardFeedSort, setBoardFeedSort] = useState<PostSortT>("hot");
  const [commentSort, setCommentSort] = useState<CommentSortT>("vote");

  useEffect(() => {
    const defaultFeedSort = localStorage.getItem("sort_FeedPage_default");
    if (defaultFeedSort) {
      setFeedSort(defaultFeedSort as PostSortT);
    }
  });

  function handleFeedSortChange(val: PostSortT): void {
    setFeedSort(val);
    localStorage.setItem("sort_FeedPage_default", val);
  }

  useEffect(() => {
    const defaultFeedSort = localStorage.getItem("sort_BoardListPage_default");
    if (defaultFeedSort) {
      setBoardSort(defaultFeedSort as BoardSortT);
    }
  });

  function handleBoardSortChange(val: BoardSortT): void {
    setBoardSort(val);
    localStorage.setItem("sort_BoardListPage_default", val);
  }

  useEffect(() => {
    const defaultFeedSort = localStorage.getItem("sort_BoardMainPage_default");
    if (defaultFeedSort) {
      setBoardFeedSort(defaultFeedSort as PostSortT);
    }
  });

  function handleBoardFeedSortChange(val: PostSortT): void {
    setBoardFeedSort(val);
    localStorage.setItem("sort_BoardMainPage_default", val);
  }

  useEffect(() => {
    const defaultCommentSort = localStorage.getItem("sort_CommentSection_default");
    if (defaultCommentSort) {
      setCommentSort(defaultCommentSort as CommentSortT);
    }
  });

  function handleCommentSortChange(val: CommentSortT): void {
    setCommentSort(val);
    localStorage.setItem("sort_CommentSection_default", val);
  }

  const { downSm } = useResponsive();

  const chipSize = downSm ? "small" : "medium";

  return (
    <>
      <Txt variant='h5'>{t("pageSetting")}</Txt>

      <Gap y={4} />

      <Txt variant='h6'>{t("all")}</Txt>
      <Divider />
      <Gap y={2} />

      <Row >
        <Txt variant='subtitle2' fontWeight={700}>{t("darkMode")}</Txt>
        <Gap x={1}/>
        <DarkModeSelector />
      </Row>

      <Gap y={2} />

      <Row>
        <Txt variant='subtitle2' fontWeight={700}>{t("language")}</Txt>
        <Gap x={1}/>
        <LocaleSelector />
      </Row>


      <Gap y={8} />

      <Txt variant='h6'>{t("home")}</Txt>
      <Divider />
      <Gap y={2} />

      <Txt
        variant='subtitle2'
        fontWeight={700}
      >
        {t("defaultPostSort")}
      </Txt>

      <Gap y={1} />

      <DefaultSortSelector
        sortCands={[
          { sort: "hot", label: t("sortHot") },
          { sort: "recent", label: t("sortRecent") },
        ]}
        value={feedSort}
        size={chipSize}
        onChange={handleFeedSortChange}
      />

      <Gap y={8} />

      <Txt variant='h6'>{t("allBoard")}</Txt>
      <Divider />
      <Gap y={2} />

      <Txt variant='subtitle2' fontWeight={700}>{t("defaultBoardSort")}</Txt>

      <Gap y={1} />

      <DefaultSortSelector
        sortCands={[
          { sort: "hot", label: t("sortActive") },
          { sort: "follower", label: t("sortFollower") },
          { sort: "recent", label: t("sortRecentCreated") },
        ]}
        value={boardSort}
        size={chipSize}
        onChange={handleBoardSortChange}
      />

      <Gap y={8} />

      <Txt variant='h6'>{t("boardMain")}</Txt>
      <Divider />

      <Gap y={2} />

      <Txt variant='subtitle2' fontWeight={700}>{t("defaultPostSort")}</Txt>

      <Gap y={1} />

      <DefaultSortSelector
        sortCands={[
          { sort: "hot", label: t("sortHot") },
          { sort: "recent", label: t("sortRecent") },
        ]}
        value={boardFeedSort}
        size={chipSize}
        onChange={handleBoardFeedSortChange}
      />

      <Gap y={2} />

      <Txt variant='subtitle2' fontWeight={700}>{t("defaultCommentSort")}</Txt>

      <Gap y={1} />

      <DefaultSortSelector
        sortCands={[
          { sort: "vote", label: t("sortVote") },
          { sort: "discussed", label: t("sortDiscussed") },
          { sort: "recent", label: t("sortRecent") },
          { sort: "old", label: t("sortOld") },
        ]}
        value={commentSort}
        size={chipSize}
        onChange={handleCommentSortChange}
      />

      <Box mt={10} />
    </>
  );
}

