"use client";
import React, { useEffect, useState } from "react";
import { Row, Box, Expand, Gap } from "@/ui/layouts";
import { IconButton, Badge } from "@mui/material";
import { CloseIcon, ArrowBackIcon } from "@/ui/icons";
import { ChatRoomMenuButton } from "./ChatRoomMenuButton";
import { BoardAuthor } from "@/components/BoardAuthor";
import { BoardNameItem } from "@/components/BoardNameItem";
import { ChatListSection } from "@/$pages/ChatPage/sections/ChatListSection";
import { ChatRoomSection } from "@/$pages/ChatPage/sections/ChatRoomSection";
import { room$getClientNumEv } from "@/system/global_events";
import type { ChatRoomT } from "@/types";

type ChatPreviewBoxProps = {
  focusedRoom: ChatRoomT | null;
  setFocusedRoom: (chatRoom: ChatRoomT | null) => void;
  onClose: () => void;
};

export function ChatPreviewBox({
  focusedRoom,
  setFocusedRoom,
  onClose,
}: ChatPreviewBoxProps): JSX.Element {

  const [clientNum, setClientNum] = useState<number | null>(null);

  useEffect(() => {
    room$getClientNumEv.addListener("chatBox", (arg) => {
      if (focusedRoom && arg.chatRoom.id == focusedRoom.id) {
        setClientNum(arg.clientNum);
      } else {
        setClientNum(null);
      }
    });
    return (): void => {
      room$getClientNumEv.removeListener("chatBox");
    };
  }, [focusedRoom]);

  function handleCloseClick(): void {
    setFocusedRoom(null);
    onClose();
  }

  function handleBackIconClick(): void {
    setFocusedRoom(null);
  }

  function handleFocusRoom(chatRoom: ChatRoomT): void {
    setFocusedRoom(chatRoom);
  }


  if (focusedRoom == null) {
    return (
      <>
        <Row width='100%'>
          <Expand />
          <IconButton
            aria-label='close-chatroom-button'
            onClick={handleCloseClick}
          >
            <CloseIcon />
          </IconButton>
        </Row>
        <ChatListSection onFocusRoom={handleFocusRoom} />
      </>
    );
  } else {
    return (
      <>
        <Row width='100%'>
          <IconButton
            aria-label='go-back-button'
            onClick={handleBackIconClick}
          >
            <ArrowBackIcon />
          </IconButton>
          <BoardAuthor author={focusedRoom.opponent ?? null} />
          {Boolean(clientNum && clientNum >= 2) && (
            <>
              <Gap x={1} />
              <Badge
                color='success'
                variant='dot'
              />
            </>
          )}

          <Expand />
          {focusedRoom.board && (
            <div style={{ transform: "scale(0.9)" }}>
              <BoardNameItem
                board={focusedRoom.board}
                disabled
              />
            </div>
          )}
          <ChatRoomMenuButton
            chatRoom={focusedRoom}
            onChatRoomClose={handleCloseClick}
            setFocusedRoom={setFocusedRoom}
          />
        </Row>

        <Box
          flex={1}
          overflow={"hidden"}
        >
          <ChatRoomSection
            chatRoom={focusedRoom}
            mt={3}
          />
        </Box>
      </>
    );
  }
}
