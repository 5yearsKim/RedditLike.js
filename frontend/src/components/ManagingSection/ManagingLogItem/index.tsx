"use client";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme, alpha } from "@mui/material/styles";
import { Row, Col, Box, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CheckIcon, DeleteOlIcon } from "@/ui/icons";
import { Tooltip } from "@/ui/tools/Tooltip";
import { BoardAuthorPreview } from "@/components/BoardAuthor";
import { AuthorFingerprint } from "@/components/AuthorFingerprint";
import { vizTime } from "@/utils/time";
import { useMe } from "@/stores/UserStore";
import type { PostManagingLogT, CommentManagingLogT } from "@/types";


export const ManagingLogItem = React.memo(_ManagingLogItem);

type ManagingLogItemProps = {
  managingLog: PostManagingLogT | CommentManagingLogT;
};


function _ManagingLogItem({
  managingLog,
}: ManagingLogItemProps): JSX.Element {
  const locale = useLocale();
  const t = useTranslations("components.ManagingSection.ManagingLogItem");
  const theme = useTheme();
  const me = useMe();

  let bgcolor = "#ffffff";
  let statusEl: JSX.Element = <></>;

  switch (managingLog.type) {
  case "approve":
    bgcolor = alpha(theme.palette.success.main, 0.1);
    statusEl = (
      <Row>
        <CheckIcon sx={{ color: "success.main" }}/>
        <Txt variant='body2' color='success.main'>{t("approve")}</Txt>
      </Row>
    );
    break;

  case "trash":
    bgcolor = alpha(theme.palette.error.main, 0.1);
    statusEl = (
      <Row>
        <DeleteOlIcon sx={{ color: "error" }}/>
        <Txt variant='body2' color='error.main'>{t("trash")}</Txt>
      </Row>
    );
    break;
  default:
    break;
  }

  return (
    <Box
      width='100%'
      bgcolor={bgcolor}
      borderRadius={2}
      p={1}
    >
      <Col width='100%'>
        <Row>
          {statusEl}

          <Gap x={1} />

          <Tooltip title={vizTime(managingLog.created_at, { type: "absolute", locale })}>
            <Txt variant='body3' color='vague.main' >{vizTime(managingLog.created_at, { type: "relative", locale })}</Txt>
          </Tooltip>

          <Gap x={1} />

          <Txt variant='body3' fontWeight={500}>by</Txt>

          <Box mr={0.5} />

          {managingLog.managed_by == "admin" ? (
            <Row>
              <Txt variant="body3" fontWeight={500}>{t("groupAdmin")}</Txt>
            </Row>
          ) : (
            <BoardAuthorPreview
              author={managingLog.author ?? null}
              textVariant='body3'
              renderInfo={() => {
                return (
                  <AuthorFingerprint
                    isMe={Boolean(me) && managingLog.user_id == me?.id}
                  />
                );
              }}
            />
          )}

        </Row>
        {managingLog.memo && managingLog.type === "trash" && (
          <Txt color='error' variant='body3' m={0.25}>{t("reason")}: {managingLog.memo}</Txt>
        )}
      </Col>
    </Box>
  );
}
