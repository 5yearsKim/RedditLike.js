"use client";
import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Row } from "@/ui/layouts";
import { RetryIcon } from "@/ui/icons";
import { CircularProgress, Button, IconButton } from "@mui/material";
import { useGroup } from "@/stores/GroupStore";
import { useLoginDialog } from "@/hooks/dialogs/LoginDialog";
// import { useSnackbar } from "@/hooks/Snackbar";
import { AccountButton } from "./AccountButton";
import { UserButton } from "./UserButton";
import { ChatBox } from "./ChatBox";
import { NotificationBox } from "./NotificationBox";

// logic
import { useAccount$ } from "@/stores/AccountStore";
import { useUser$, useUserActions } from "@/stores/UserStore";

export function NavbarActions(): ReactNode {
  const t = useTranslations("components.Navbar.NavbarActions");
  const account$ = useAccount$();
  const group = useGroup();
  const user$ = useUser$();
  const userAct = useUserActions();
  const { openLoginDialog } = useLoginDialog();

  function handleLoginClick(): void {
    openLoginDialog();
  }

  function handleUserErrorRetry(): void {
    userAct.access(group.id );
  }

  if (account$.status == "init") {
    return (
      <></>
    );
  }
  if (account$.status == "loading") {
    // account loading page
    return (
      <CircularProgress size='1.5rem'/>
    );
  }

  if (account$.status == "loggedOut") {
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
  if (user$.status == "init") {
    return <div>init me...</div>;
  }
  if (user$.status == "loading") {
    return (
      <CircularProgress size='1.5rem'/>
    );
  }
  if (user$.status == "error") {
    return (
      <IconButton onClick={handleUserErrorRetry}>
        <RetryIcon/>
      </IconButton>
    );
  }


  if (user$.status !== "loaded") {
    if (user$.status == "loading") {
      return (
        <CircularProgress size='1.5rem'/>
      );
    }
    return (
      <AccountButton/>
    );
  }

  if (user$.data.me == null) {
    return (
      <Row>
        <Link href='/join-group'>
          <Button variant='outlined'>
            {t("joinGroup")}
          </Button>
        </Link>
        <AccountButton/>
      </Row>
    );
  }


  return (
    <Row>

      <ChatBox/>

      <NotificationBox/>

      <UserButton
        account={account$.data!.account}
        me={user$.data.me}
        muter={user$.data.muter}
      />
    </Row>
  );
}