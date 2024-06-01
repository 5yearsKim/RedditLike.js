import React from "react";
import { Box, Dialog, IconButton, Badge } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { BoardNameItem } from "@/components/BoardNameItem";
import { BoardAuthor } from "@/components/BoardAuthor";
import { Row, Gap, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { SlideTransition } from "@/ui/tools/SlideTransition";
import { CloseIcon, GroupIcon } from "@/ui/icons";
import { ChatRoomSection } from "@/$pages/ChatPage/sections/ChatRoomSection";
// logic
import { useEffect, useState } from "react";
import { room$getClientNumEv } from "@/system/global_events";
import type { ChatRoomT, AuthorT } from "@/types";


export type LiveChatDialogProps = {
  chatRoom: ChatRoomT;
  author?: AuthorT | null;
  open: boolean;
  disableInitialSocketConnection?: boolean;
  onClose: () => void;
};

export function LiveChatDialog({
  chatRoom,
  author,
  open,
  disableInitialSocketConnection,
  onClose,
}: LiveChatDialogProps): JSX.Element {

  const [clientNum, setClientNum] = useState<number | null>(null);

  useEffect(() => {
    room$getClientNumEv.addListener("liveChatFab", (arg) => {
      if (arg.chatRoom.id == chatRoom.id) {
        setClientNum(arg.clientNum);
      }
    });
    return (): void => {
      room$getClientNumEv.removeListener("liveChatFab");
    };
  }, []);

  function handleClose(): void {
    onClose();
  }

  const { downSm } = useResponsive();

  return (
    <Dialog
      open={open}
      TransitionComponent={SlideTransition}
      keepMounted
      onClose={handleClose}
      fullScreen={downSm ? true : false}
      fullWidth
    >
      <Box
        position='absolute'
        top='0'
        width='100%'
        zIndex={1600}
        bgcolor='paper.main'
        boxShadow={"0 0 6px 1px rgba(0,0,0,0.2)"}
      >
        <Row>
          {chatRoom.board && (
            <>
              <Gap x={2} />
              <BoardNameItem board={chatRoom.board} />
            </>
          )}
          {clientNum !== null && (
            <>
              <Gap x={1} />
              <Badge
                color='success'
                variant='dot'
              >
                <GroupIcon sx={{ fontSize: 16, color: "vague.light" }} />
              </Badge>
              <Gap x={1} />
              <Txt
                variant='body3'
                color='vague.light'
              >
                {clientNum}
              </Txt>
            </>
          )}
          <Expand />
          {author && (
            <Box mr={3}>
              <BoardAuthor
                author={author}
                renderInfo={
                  author.nickname
                    ? undefined
                    : (): JSX.Element => (
                      <Row alignSelf='flex-start'>
                        <Box
                          ml={0.5}
                          fontSize='10px'
                          color='vague.light'
                        >
                          #{author.temp_id}
                        </Box>
                      </Row>
                    )
                }
              />
            </Box>
          )}
          <IconButton
            aria-label='close-chatroom'
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Row>
      </Box>
      <Box
        height={downSm ? "fill-available" : "80vh"}
        maxHeight={downSm ? undefined : "600px"}
        width='100%'
      >
        {open && (
          <ChatRoomSection
            chatRoom={chatRoom}
            mt={4}
            disableInitialSocketConnection={disableInitialSocketConnection}
          />
        )}
      </Box>
    </Dialog>
  );
}
