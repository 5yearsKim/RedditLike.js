"use client";
import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Row } from "@/ui/layouts";
import { RetryIcon } from "@/ui/icons";
import { CircularProgress, Button, IconButton } from "@mui/material";
import { useLoginDialog } from "@/hooks/dialogs/LoginDialog";
// import { useSnackbar } from "@/hooks/Snackbar";
import { UserButton } from "./UserButton";
import { ChatBox } from "./ChatBox";
import { NotificationBox } from "./NotificationBox";

// logic
import { useUser$, useUserActions } from "@/stores/UserStore";

export function NavbarActions(): ReactNode {
  const t = useTranslations("components.Navbar.NavbarActions");
  const user$ = useUser$();
  const userAct = useUserActions();
  const { openLoginDialog } = useLoginDialog();

  function handleLoginClick(): void {
    openLoginDialog();
  }

  function handleUserErrorRetry(): void {
    userAct.refresh();
  }

  if (user$.status == "init") {
    return (
      <></>
    );
  }
  if (user$.status == "loading") {
    // account loading page
    return (
      <CircularProgress size='1.5rem'/>
    );
  }

  if (user$.status == "loaded" && user$.data.me == null) {
    // account error page
    return (
      <Button
        variant='outlined'
        onClick={handleLoginClick}
      >
        {t("login")}
      </Button>
    );
  }

  // account loaded from below
  if (user$.status == "error") {
    return (
      <IconButton onClick={handleUserErrorRetry}>
        <RetryIcon/>
      </IconButton>
    );
  }


  return (
    <Row>

      <ChatBox/>

      <NotificationBox/>

      <UserButton
        me={user$.data.me!}
        muter={user$.data.muter ?? null}
      />
    </Row>
  );
}