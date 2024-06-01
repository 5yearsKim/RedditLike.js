import React from "react";
import { useTranslations } from "next-intl";
import { InputBase, Fab } from "@mui/material";
import { Box, Row } from "@/ui/layouts";
import { SendIcon } from "@/ui/icons";
// logic
import { useState, useMemo, useRef, ChangeEvent, KeyboardEvent } from "react";
import * as ChatSocket from "@/sockets/chat";
import { useMe } from "@/stores/UserStore";
import { useChatQueueActions } from "@/stores/ChatQueueStore";
import type { ChatRoomT, ChatMessageFormT } from "@/types";

type ChatInputProps = {
  chatRoom: ChatRoomT;
};

// eslint-disable-next-line
export function ChatInput({ chatRoom }: ChatInputProps): JSX.Element {
  const t = useTranslations("pages.ChatPage.ChatRoomSection.ChatInput");

  const inputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<string>("");
  const me = useMe();
  const chatQueueAct = useChatQueueActions();

  const isIsolated = useMemo(() => {
    const participants = chatRoom.participants ?? [];
    if (participants.length == 1 && participants[0].user_id == me?.id) {
      return true;
    }
    return false;
  }, []);

  function handleSendClick(): void {
    if (message.trim().length == 0) {
      return;
    }
    try {
      const requestId = Math.random().toString();
      const requestedAt = new Date();
      const form: ChatMessageFormT = {
        room_id: chatRoom.id,
        body: message,
        sender_id: me!.id,
      };
      ChatSocket.emitSendMessage(requestId, form);
      chatQueueAct.splice("sending", 0, 0, {
        requestId,
        requestedAt,
        form,
        roomId: chatRoom.id,
      });
      setMessage("");
      inputRef.current?.focus();
    } catch (e) {
      console.warn(e);
    }
  }

  function handleSendKeyDown(e: KeyboardEvent): void {
    // prevent double pressing error
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  }

  function handleMessageChange(e: ChangeEvent<HTMLInputElement>): void {
    setMessage(e.target.value);
  }

  if (isIsolated) {
    return (
      <Box
        py={0.5}
        px={1}
      >
        <InputBase
          fullWidth
          disabled
          placeholder={t("theOtherPartyLeftChatRoom")}
        />
      </Box>
    );
  }

  return (
    <Box
      px={1}
      py={0.5}
    >
      <Row>
        <InputBase
          inputRef={inputRef}
          value={message}
          onChange={handleMessageChange}
          fullWidth
          placeholder={t("typeMessage")}
          multiline
          autoComplete='off'
          maxRows={4}
          onKeyDown={handleSendKeyDown}
        />
        <Fab
          size='small'
          color='primary'
          onClick={(e): void => {
            e.preventDefault();
            handleSendClick();
          }}
        >
          <SendIcon fontSize='small' />
        </Fab>
      </Row>
    </Box>
  );
}
