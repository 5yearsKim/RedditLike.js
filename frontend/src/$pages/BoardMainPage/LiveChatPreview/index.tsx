import React, { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Box, Button, Collapse } from "@mui/material";
import { useUrlState } from "@/hooks/UrlState";
import { MessageList, MessageListT } from "@/$pages/ChatPage/sections/ChatRoomSection/MessageList";
import { Gap } from "@/ui/layouts";
import { LiveChatIcon } from "@/ui/icons";
import * as ChatSocket from "@/sockets/chat";
import { LiveChatDialog } from "../LiveChatDialog";
import type { ChatRoomT, AuthorT } from "@/types";

type LiveChatPreviewProps = {
  chatRoom: ChatRoomT;
  messageSize?: "small" | "medium";
  author?: AuthorT | null;
  maxHeight: number | string;
  openOnInit?: boolean;
};

export function LiveChatPreview({
  chatRoom,
  messageSize,
  author,
  maxHeight,
  openOnInit,
}: LiveChatPreviewProps): JSX.Element {
  const t = useTranslations("pages.BoardMainPage.LiveChatPreview");

  const messageListRef = useRef<MessageListT | null>(null);
  const [dialogOpen, setDialogOpen] = useUrlState<boolean>({
    key: "liveChatOpen",
    query2val: (query) => query === "true",
    val2query: (val) => val ? "true" : null,
    backOn: (val) => !val,
  });

  useEffect(() => {
    ChatSocket.emitWatchRoom(chatRoom);
    return () => ChatSocket.emitUnwatchRoom(chatRoom);
  }, [dialogOpen]);

  useEffect(() => {
    if (openOnInit) {
      handleDialogOpen();
    }
  }, []);

  function handleDialogOpen(): void {
    setDialogOpen(true);
  }

  function handleDialogClose(): void {
    setDialogOpen(false);
    messageListRef.current?.refreshWithoutLoading();
  }

  return (
    <>
      <Collapse in={!dialogOpen}>
        <Box
          display='flex'
          flexDirection='column-reverse'
          // height={downSm ? 'fill-available' : '80vh'}
          maxHeight={maxHeight}
          overflow='hidden'
          width='100%'
        >
          <Button
            onClick={handleDialogOpen}
            startIcon={<LiveChatIcon fontSize='small' />}
            variant='outlined'
          >
            {t("join")}
          </Button>

          <Gap y={1}/>

          <Box
            position='relative'
            flex={1}
            display='flex'
            flexDirection='column-reverse'
            sx={{
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <MessageList
              ref={messageListRef}
              socketKey='chatPreview'
              chatRoom={chatRoom}
              messageSize={messageSize}
            />
          </Box>
        </Box>
      </Collapse>
      <LiveChatDialog
        chatRoom={chatRoom}
        author={author}
        onClose={handleDialogClose}
        open={dialogOpen}
        disableInitialSocketConnection
      />
    </>
  );
}
