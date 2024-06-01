import React from "react";
import { Col, Box } from "@/ui/layouts";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { ChatRoomT } from "@/types";
import { useEffect } from "react";
import * as ChatSocket from "@/sockets/chat";


export const ChatRoomSection = React.memo(_ChatRoomSection);


export type ChatRoomSectionProps = {
  chatRoom: ChatRoomT;
  mt?: number | string;
  disableInitialSocketConnection?: boolean;
};

function _ChatRoomSection({
  chatRoom,
  mt,
  disableInitialSocketConnection,
}: ChatRoomSectionProps): JSX.Element {


  useEffect(() => {
    if (disableInitialSocketConnection) {
      return;
    }
    ChatSocket.emitWatchRoom(chatRoom);
    return (): void => {
      ChatSocket.emitUnwatchRoom(chatRoom);
    };
  }, []);

  return (
    <Col
      height='100%'
      flexDirection='column-reverse'
    >
      <Box
        // flexGrow={1}
        flexShrink={0}
        boxShadow={"0 0 6px 1px rgba(0,0,0,0.2)"}
      >
        <ChatInput chatRoom={chatRoom} />
      </Box>
      <Box
        position='relative'
        flex={1}
        display='flex'
        flexDirection='column-reverse'
        p={1}
        mt={mt}
        sx={{
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        <MessageList chatRoom={chatRoom} />
      </Box>
    </Col>
  );
}
