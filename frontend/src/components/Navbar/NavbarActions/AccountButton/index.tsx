"use client";
import React, { useState, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import {
  Button, CircularProgress, IconButton,
  Menu, MenuItem, ListItemIcon, ListItemText,
} from "@mui/material";
import { Row, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { AccountIcon, LogoutIcon } from "@/ui/icons";
import { Clickable } from "@/ui/tools/Clickable";
// logic
import { useLoginDialog } from "@/hooks/dialogs/LoginDialog";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useAccount$, useAccountActions } from "@/stores/AccountStore";
import { useResponsive } from "@/hooks/Responsive";


export function AccountButton(): JSX.Element {
  const t = useTranslations("components.Navbar.NavbarActions.AccountButton");
  const account$ = useAccount$();
  const accountAct = useAccountActions();
  const { downSm } = useResponsive();
  const { openLoginDialog } = useLoginDialog();
  const { showAlertDialog } = useAlertDialog();
  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(menuEl);

  function handleLoginClick(): void {
    openLoginDialog();
  }

  function handleMenuOpen(e: MouseEvent<HTMLElement>): void {
    setMenuEl(e.currentTarget);
  }

  function handleMenuClose(): void {
    setMenuEl(null);
  }

  async function handleLogout(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("logout"),
      body: t("logoutMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    accountAct.logout();
    setMenuEl(null);
  }


  if (account$.status == "init" || account$.status == "loggedOut") {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={handleLoginClick}
      >
        {t("login")}
      </Button>
    );
  }
  if (account$.status == "loading") {
    return (
      <CircularProgress size='1.5rem'/>
    );
  }

  const account = account$.data!.account;

  return (
    <>
      {downSm ? (
        <IconButton
          aria-label='account-icon'
          size='small'
          onClick={handleMenuOpen}
          sx={{ position: "relative" }}
        >
          <AccountIcon sx={{ color: "vague.light" }} />
        </IconButton>
      ) : (
        <Clickable
          onClick={handleMenuOpen}
          borderRadius={1}
          px={1}
          py={1}
        >
          <Row justifyContent='center' position='relative' >
            <AccountIcon sx={{ color: "vague.light" }} />

            <Box ml={1} mb={0.5}>
              <Txt color='vague.main' variant='body3'>{account.email}</Txt>
            </Box>
          </Row>
        </Clickable>
      )}
      <Menu
        open={isMenuOpen}
        anchorEl={menuEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
      >
        {downSm && (
          <Box
            px={1.5}
            width='100%'
            display='flex'
            justifyContent='center'
          >
            <Txt color='vague.main' variant='body3'>{account.email}</Txt>
          </Box>
        )}

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>{t("logout")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );

}