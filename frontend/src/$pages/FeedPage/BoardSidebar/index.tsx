"use client";
import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Divider } from "@mui/material";
import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

import { useMe } from "@/stores/UserStore";
import { HotBoardList, RecentBoardList, FollowingBoardList } from "./items";

export function BoardSidebar(): ReactNode {
  const t = useTranslations("pages.FeedPage.BoardSidebar");
  const me = useMe();

  return (
    <Col
      bgcolor='paper.main'
      width='100%'
      borderRadius={2}
    >
      <Row py={1} px={2}>
        <Txt variant='subtitle2' fontWeight={500}>{t("recentVisit")}</Txt>
      </Row>

      <RecentBoardList />

      {me && (
        <>
          <Divider sx={{ mx: 2 }} />

          <Gap y={1}/>

          <Row px={2}>
            <Txt variant='subtitle2' fontWeight={500}>{t("subscribed")}</Txt>
          </Row>

          <FollowingBoardList />

          <Gap y={1}/>
        </>
      )}

      {!me && (
        <>
          <Divider sx={{ mx: 2 }} />

          <Row
            py={1}
            px={2}
          >
            <Txt variant='subtitle2' fontWeight={500}>{t("activeBoards")}</Txt>
          </Row>

          <HotBoardList />
        </>
      )}
    </Col>
  );
}
