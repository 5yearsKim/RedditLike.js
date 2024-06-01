"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ForwardIosIcon, BackIosIcon } from "@/ui/icons";
import { Button, IconButton } from "@mui/material";
import { BlockedUserSection } from "./BlockedUserSection";
// logic

export function ChatTab(): JSX.Element {
  const t = useTranslations("pages.SettingPage.ChatTab");
  const [detail, setDetail] = useState<"blockedUser" | undefined>();

  function handleNavigateBlockedUser(): void {
    setDetail("blockedUser");
  }

  function handleBackClick(): void {
    setDetail(undefined);
  }

  if (detail == "blockedUser") {
    return (
      <>
        <Row>
          <IconButton onClick={handleBackClick}>
            <BackIosIcon sx={{ color: "text.primary" }} />
          </IconButton>
          <Txt variant='h5'>{t("blockedUser")}</Txt>
        </Row>
        <Gap y={2} />
        <BlockedUserSection />
      </>
    );
  }

  return (
    <>
      <Txt variant='h5'>{t("chatSetting")}</Txt>

      <Gap y={4} />

      <Button
        endIcon={<ForwardIosIcon />}
        onClick={handleNavigateBlockedUser}
      >
        {t("blockedUser")}
      </Button>
    </>
  );
}

