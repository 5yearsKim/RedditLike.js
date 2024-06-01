"use client";
import React, { useState, MouseEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ChatOlIcon, BlockIcon } from "@/ui/icons";
import { Clickable } from "@/ui/tools/Clickable";

import * as ChatRoomApi from "@/apis/chat_rooms";
// import { useChatBox } from "@/hooks/ChatBox";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useMe, useMeAdmin } from "@/stores/UserStore";
import { usePostDialog } from "@/hooks/dialogs/PostDialog";
import { useBlockAuthorDialog } from "@/hooks/dialogs/BlockAuthorDialog";
import { useChatBox } from "@/hooks/ChatBox";
import { useResponsive } from "@/hooks/Responsive";
import type { AuthorT, BoardManagerT } from "@/types";

type BoardAuthorInteractionProps = {
  meManager: BoardManagerT | null;
  author: AuthorT | null;
  children: ReactNode;
};

export function BoardAuthorInteraction({
  meManager,
  author,
  children,
}: BoardAuthorInteractionProps): ReactNode {
  const t = useTranslations("components.BoardAuthorInteraction");
  const me = useMe();
  const admin = useMeAdmin();
  const { downSm } = useResponsive();
  const { closePostDialog } = usePostDialog();
  const { showAlertDialog } = useAlertDialog();
  const { openChatBox, setFocusedRoom } = useChatBox();
  const { openBlockAuthorDialog } = useBlockAuthorDialog();

  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const disabled = !me || me.id == author?.id || author == null;

  function handleClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setMenuEl(e.currentTarget);
  }

  function handleClose(): void {
    setMenuEl(null);
  }

  async function handleChatClick(): Promise<void> {
    if (!me || !author || me.id == author.id) {
      console.log("error: me == author");
      return;
    }
    try {
      const created = await ChatRoomApi.init(author.board_id, author.id);
      const { data: chatRoom } = await ChatRoomApi.get(created.id, {
        $board: true,
        $participants: true,
        $last_message: true,
        $opponent: true,
      });
      openChatBox();
      setFocusedRoom(chatRoom);
      setMenuEl(null);
      closePostDialog();
    } catch (e: any) {
      if (e.response?.data?.code == "INVALID_ACTION") {
        showAlertDialog({
          title: t("chatBlocked"),
          body: t("chatBlockedMsg"),
          useOk: true,
        });
        setMenuEl(null);
        return;
      }
      console.warn(e);
    }
  }


  async function handleBlockAuthor(e: MouseEvent<HTMLElement>, type: "board"|"group"): Promise<void> {
    e.preventDefault();
    if (!author) {
      return;
    }
    openBlockAuthorDialog(type, author);
    setMenuEl(null);
  }


  if (disabled) {
    return children;
  }

  return (
    <>
      <Clickable
        py={0.5}
        px={1}
        mx={-1}
        borderRadius={0.75}
        overflow='visible'
        onClick={handleClick}
      >
        {children}
      </Clickable>
      <Menu
        open={Boolean(menuEl)}
        anchorEl={menuEl}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        onClose={handleClose}
      >
        <MenuItem
          onClick={handleChatClick}
          dense={downSm}
        >
          <ListItemIcon>
            <ChatOlIcon />
          </ListItemIcon>
          <ListItemText>{t("chat")}</ListItemText>
        </MenuItem>

        {/* 게시판 매니저 */}
        {meManager && [
          <Divider key='manager-divider'/>,
          <Box px={1.5} pb={1} key='manager-title'>
            <Txt variant="body3" fontWeight={700}>{t("managerFeature")}</Txt>
          </Box>,
          <MenuItem
            key='board-muter'
            dense={downSm}
            disabled={meManager.manage_muter !== true}
            onClick={(e) => handleBlockAuthor(e, "board")}
          >
            <ListItemIcon>
              <BlockIcon/>
            </ListItemIcon>
            <ListItemText>{t("muteBoard")}</ListItemText>
          </MenuItem>,
        ]}

        {/* admin section */}
        {admin && [
          <Divider key='admin-divider'/>,
          <Box px={1.5} pb={1} key='admin-title'>
            <Txt variant="body3" fontWeight={700}>{t("adminFeature")}</Txt>
          </Box>,
          <MenuItem
            key='group-muter'
            dense={downSm}
            disabled={admin.manage_muter !== true}
            onClick={(e) => handleBlockAuthor(e, "group")}
          >
            <ListItemIcon>
              <BlockIcon/>
            </ListItemIcon>
            <ListItemText>{t("muteGroup")}</ListItemText>
          </MenuItem>,
        ]
        }
      </Menu>
    </>
  );
}
