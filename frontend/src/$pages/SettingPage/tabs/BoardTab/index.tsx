"use client";
import React, { useState, Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button, IconButton, Divider } from "@mui/material";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BackIosIcon, ForwardIosIcon } from "@/ui/icons";
import { BlockedBoardSection } from "./BlockedBoardSection";


export function BoardTab(): JSX.Element {
  const t = useTranslations("pages.SettingPage.BoardTab");
  const [detail, setDetail] = useState<"blockedBoard" | undefined>();

  function handleNavigateBlockedBoard(): void {
    setDetail("blockedBoard");
  }

  function handleBackClick(): void {
    setDetail(undefined);
  }

  if (detail == "blockedBoard") {
    return (
      <Fragment>
        <Row>
          <IconButton onClick={handleBackClick}>
            <BackIosIcon sx={{ color: "text.primary" }} />
          </IconButton>
          <Txt variant='h5'>{t("blockedBoard")}</Txt>
        </Row>
        <Gap y={2} />
        <BlockedBoardSection />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Txt variant='h5'>{t("boardSetting")}</Txt>

      <Gap y={4} />

      <Txt variant='h6'>{t("block")}</Txt>
      <Divider />
      <Gap y={2} />

      <Button
        endIcon={<ForwardIosIcon />}
        onClick={handleNavigateBlockedBoard}
      >
        {t("blockedBoard")}
      </Button>
    </Fragment>
  );
}
