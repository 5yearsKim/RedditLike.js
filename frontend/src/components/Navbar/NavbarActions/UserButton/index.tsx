"use client";
import React, { useState, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Menu, MenuItem, IconButton,
  ListItemIcon, ListItemText, Divider,
} from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { Box, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { AccountIcon, HistoryIcon, SettingIcon, LogoutIcon, BlockIcon } from "@/ui/icons";
import { Clickable } from "@/ui/tools/Clickable";
import { useUrlState } from "@/hooks/UrlState";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { useUserActions } from "@/stores/UserStore";
import { UserT, MuterT } from "@/types";


type UserButtonProps = {
  me: UserT
  muter: MuterT|null
}

export function UserButton({
  me,
  muter,
}: UserButtonProps) {
  const t = useTranslations("components.Navbar.NavbarActions.UserButton");
  const { downSm } = useResponsive();
  // const router = useRouter();
  const router = useRouter();

  const userAct = useUserActions();
  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useUrlState<boolean>({
    key: "userMenuBox",
    val2query: (val) => val ? "true" : null,
    query2val: (query) => query == "true",
    backOn: (val) => !val,
  });

  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  function handleMenuOpen(e: MouseEvent<HTMLElement>): void {
    setMenuEl(e.currentTarget);
    setIsMenuOpen(true);
  }


  function handleMenuClose() {
    setIsMenuOpen(false);
  }

  function handleSettingClick(): void {
    router.replace("/settings/page");
  }

  function handleAccountManageClick(): void {
    router.replace("/accounts");
  }


  function handleActivityClick(): void {
    router.replace("/activities/post");
  }

  function handleRestrictionClick(): void {
    router.replace("/restrictions");
  }

  async function handleLogout() {
    const isOk = await showAlertDialog({
      title: t("logout"),
      body: t("logoutMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) return;
    userAct.logout();
    enqueueSnackbar(t("logoutSucess"), { variant: "success" });
  }


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
          <Row justifyContent='center' position='relative'>
            <AccountIcon sx={{ color: "vague.light" }} />

            {me && (
              <Box ml={1} mb={0.5}>
                <Txt color='vague.main' variant='body3'>{me.email}</Txt>
              </Box>
            )}
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
            <Txt color='vague.main' variant='body3'>{me.email}</Txt>
          </Box>
        )}


        <MenuItem onClick={handleActivityClick}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText>{t("myActivity")}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleAccountManageClick}>
          <ListItemIcon>
            <AccountIcon />
          </ListItemIcon>
          <ListItemText>{t("manageAccount")}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleSettingClick}>
          <ListItemIcon>
            <SettingIcon />
          </ListItemIcon>
          <ListItemText>{t("setting")}</ListItemText>
        </MenuItem>

        {muter && (
          <MenuItem onClick={handleRestrictionClick}>
            <ListItemIcon>
              <BlockIcon/>
            </ListItemIcon>
            <ListItemText>{t("restriction")}</ListItemText>
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5 }} />

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