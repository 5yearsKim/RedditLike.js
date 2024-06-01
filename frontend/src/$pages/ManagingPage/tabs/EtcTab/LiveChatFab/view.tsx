import React, { forwardRef } from "react";
import { useResponsive } from "@/hooks/Responsive";
import { Box, Button, Dialog, IconButton, Badge } from "@mui/material";

import { LiveChatIcon, CloseIcon, GroupIcon } from "@/ui/icons";
import { Row, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { SlideTransition } from "@/ui/tools/SlideTransition";
import { ChatRoomSection } from "@/$pages/ChatPage/sections/ChatRoomSection";
import { BoardNameItem } from "@/components/BoardNameItem";
import { BoardAuthor } from "@/components/BoardAuthor";
import { WobbleBox } from "./style";
import type { LiveChatFabProps, LiveChatFabT } from "./type";
import { useLogic } from "./logic";

export const LiveChatFab = forwardRef<LiveChatFabT, LiveChatFabProps>((props: LiveChatFabProps, ref): JSX.Element => {
  const { chatRoom, author, chatOpen, clientNum, handleClick, handleChatClose } = useLogic(props, ref);

  const { downSm } = useResponsive();

  return (
    <>
      <WobbleBox focused={false}>
        <Button
          onClick={handleClick}
          startIcon={<LiveChatIcon fontSize='small' />}
          size='large'
        >
          live chat
        </Button>
      </WobbleBox>
      <Dialog
        open={chatOpen}
        TransitionComponent={SlideTransition}
        keepMounted
        onClose={handleChatClose}
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
              onClick={handleChatClose}
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
          {chatOpen && (
            <ChatRoomSection
              chatRoom={chatRoom}
              mt={4}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
});
