"use client";
import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { MenuIcon, CloseIcon, BlockIcon, LogoutIcon } from "@/ui/icons";
// logic
import { useState, MouseEvent } from "react";
import { useSnackbar } from "@/hooks/Snackbar";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useMe } from "@/stores/UserStore";
import * as BoardUserBlockApi from "@/apis/board_user_blocks";
import * as ChatRoomApi from "@/apis/chat_rooms";
import { refreshChatRoomsEv } from "@/system/global_events";
import type { ChatRoomT } from "@/types";

type ChatRoomMenuButonProps = {
  chatRoom: ChatRoomT;
  onChatRoomClose: () => void;
  setFocusedRoom: (focusedRoom: null | ChatRoomT) => void;
};


export function ChatRoomMenuButton({
  chatRoom,
  onChatRoomClose,
  setFocusedRoom,
}: ChatRoomMenuButonProps): JSX.Element {
  const t = useTranslations("components.Navbar.NavbarActions.ChatBox.ChatPreviewBox.ChatRoomMenuButton");
  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();
  const me = useMe();
  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);

  function handleIconClick(e: MouseEvent<HTMLButtonElement>): void {
    e.stopPropagation();
    setMenuEl(e.currentTarget);
  }

  function handleMenuClose(): void {
    setMenuEl(null);
  }

  function handleChatRoomClose(): void {
    setMenuEl(null);
    onChatRoomClose();
  }

  async function handleBlockClick(): Promise<void> {
    if (!chatRoom.opponent) {
      enqueueSnackbar(t("cannotBlock"), { variant: "error" });
      return;
    }
    const isOk = await showAlertDialog({
      title: t("blockUser"),
      body: t("blockUserMsg"),
      useCancel: true,
      useOk: true,
      themeDisabled: true,
    });
    if (isOk !== true) {
      return;
    }
    try {
      // leave chatRoom
      await ChatRoomApi.leaveChat(chatRoom.id);

      // block user
      await BoardUserBlockApi.create({
        from_id: me!.id,
        board_id: chatRoom.board_id,
        target_id: chatRoom.opponent.id,
      });
      setFocusedRoom(null);

      enqueueSnackbar(t("blockUserSuccess"), { variant: "success" });

      refreshChatRoomsEv.emit("block");
    } catch (e) {
      enqueueSnackbar(t("blockUserFailed"), { variant: "error" });
      console.warn(e);
    }
  }

  async function handleLeaveRoomClick(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("leaveChat"),
      body: t("leaveChatMsg"),
      useCancel: true,
      useOk: true,
      themeDisabled: true,
    });

    if (isOk !== true) {
      return;
    }
    try {
      // leave chatRoom
      await ChatRoomApi.leaveChat(chatRoom.id);
      setFocusedRoom(null);

      refreshChatRoomsEv.emit("leave");
    } catch (e) {
      enqueueSnackbar(t("leaveChatFailed"), { variant: "error" });
      console.warn(e);
    }
  }


  const opponent = useMemo(() => {
    const val = chatRoom.opponent;
    if (val?.deleted_at) {
      return null;
    }
    return val;
  }, []);

  return (
    <>
      <IconButton
        aria-label='chatroom-menu-button'
        onClick={handleIconClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleChatRoomClose}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>{" "}
          {t("closeChat")}
        </MenuItem>
        {opponent && (
          <MenuItem onClick={handleBlockClick}>
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>{" "}
            {t("blockUser")}
          </MenuItem>
        )}
        {opponent && (
          <MenuItem onClick={handleLeaveRoomClick}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>{" "}
            {t("leave")}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
