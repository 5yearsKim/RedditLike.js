import React, { ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button, Box, Divider } from "@mui/material";
import { ManagerIcon } from "@/ui/icons";
import { Col, Center, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Tooltip } from "@/ui/tools/Tooltip";
import { shortenNumber } from "@/utils/formatter";
import { vizDate, vizTime } from "@/utils/time";
import { BoardT } from "@/types/Board";


export type AboutBoardProps = {
  board: BoardT;
  isManager: boolean;
};

export function AboutBoard({
  board,
  isManager,
}: AboutBoardProps): ReactNode {
  const t = useTranslations("pages.BoardMainPage.AboutBoard");
  const locale = useLocale();

  return (
    <Col>
      <Box mb={2}>
        <Txt color='vague.main'>{board.description}</Txt>
      </Box>

      {isManager && (
        <Row justifyContent='flex-end'>
          <Link href={`/boards/${board.id}/managings/censor`}>
            <Button startIcon={<ManagerIcon />}>{t("manageBoard")}</Button>
          </Link>
        </Row>
      )}

      {board.allow_post_manager_only ? (
        <Row justifyContent='flex-end'>
          <Txt
            variant='body3'
            color='vague.main'
          >
            *{t("allowPostManagerOnly")}
          </Txt>
        </Row>
      ) : (
        <></>
      )}

      <Divider />
      <Row justifyContent='space-around'>
        <Col alignItems='center' >
          <Txt variant='subtitle2'>{t("subscribe")}</Txt>
          <Txt variant='h6'>{shortenNumber(board.num_follower, { locale })}</Txt>
        </Col>
        <Divider
          orientation='vertical'
          flexItem
        />
        <Col alignItems='center'>
          <Txt variant='subtitle2'>{t("post")}</Txt>
          <Txt variant='h6'>{shortenNumber(board.num_post, { locale })}</Txt>
        </Col>
        <Divider
          orientation='vertical'
          flexItem
        />
        <Col alignItems='center' maxWidth={100}>
          <Txt variant='subtitle2'>{t("createdAt")}</Txt>
          <Tooltip
            title={vizDate(board.created_at, { type: "literal", locale })}
            arrow
          >
            <div>
              <Center minHeight={30} sx={{ textAlign: "center" }}>
                <Txt variant='body2' fontWeight={700}>{vizTime(board.created_at, { type: "relative", locale })}</Txt>
              </Center>
            </div>
          </Tooltip>
        </Col>
      </Row>
    </Col>
  );
}