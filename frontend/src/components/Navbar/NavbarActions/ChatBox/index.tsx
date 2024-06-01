"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { useResponsive } from "@/hooks/Responsive";
import { IconButton, Badge, Box, Dialog } from "@mui/material";
import { Tooltip } from "@/ui/tools/Tooltip";
import { SlideTransition } from "@/ui/tools/SlideTransition";
import { ChatIcon } from "@/ui/icons";
import { useChatRoomsStore } from "@/stores/ChatRoomsStore";
import { useChatBox } from "@/hooks/ChatBox";
import { ChatEventProvider } from "./event_provider";
import { ChatPreviewBox } from "./ChatPreviewBox";

// wrapper component
export function ChatBox(): JSX.Element {
  const t = useTranslations("components.Navbar.NavbarActions.ChatBox");
  const { downSm } = useResponsive();
  const { chatBoxOpen, focusedRoom, setFocusedRoom, openChatBox, closeChatBox } = useChatBox();

  const { data: chatRooms$ } = useChatRoomsStore();

  function handleIconClick(): void {
    if (chatBoxOpen) {
      closeChatBox();
    } else {
      openChatBox();
    }
  }

  function handlePreviewClose(): void {
    closeChatBox();
  }

  const unreadCntSum = chatRooms$.data.reduce((sum, room) => sum + (room.unread_cnt ?? 0), 0);

  return (
    <ChatEventProvider>
      <Tooltip title={t("chat")}>
        <IconButton
          aria-label='chatting-icon'
          size={downSm ? "small" : "medium"}
          onClick={handleIconClick}
        >
          <Badge
            color='secondary'
            badgeContent={unreadCntSum}
          >
            <ChatIcon sx={{ color: "vague.light" }} />
          </Badge>
        </IconButton>
      </Tooltip>
      {!downSm && chatBoxOpen && (
        <Box
          position='fixed'
          zIndex={2000}
          bottom={8}
          right={8}
          display='flex'
          flexDirection='column'
          overflow='hidden'
          bgcolor='paper.main'
          borderRadius={2}
          boxShadow={2}
          width='100%'
          maxWidth='400px'
          // height='70vh'
          height='650px'
        >
          <ChatPreviewBox
            focusedRoom={focusedRoom}
            setFocusedRoom={setFocusedRoom}
            onClose={handlePreviewClose}
          />
        </Box>
      )}
      {downSm && chatBoxOpen && (
        <>
          <Dialog
            open={chatBoxOpen}
            TransitionComponent={SlideTransition}
            keepMounted
            onClose={handlePreviewClose}
            fullScreen
          >
            <ChatPreviewBox
              focusedRoom={focusedRoom}
              setFocusedRoom={setFocusedRoom}
              onClose={handlePreviewClose}
            />
          </Dialog>
        </>
      )}
    </ChatEventProvider>
  );
}
