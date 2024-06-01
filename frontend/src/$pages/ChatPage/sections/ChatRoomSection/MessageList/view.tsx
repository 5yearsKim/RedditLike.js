import React, { Fragment, forwardRef } from "react";
import { useTranslations } from "next-intl";
import { ButtonBase } from "@mui/material";
import { red } from "@mui/material/colors";
import { ListView, AppendLoading, AppendError } from "@/ui/tools/ListView";
import { Box, Row, Col, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CloseIcon, RetryIcon } from "@/ui/icons";
import { LoadingIndicator, ErrorBox } from "@/components/$statusTools";
import { ChatMessageItem, ChatMessageBodyItem } from "@/components/ChatMessageItem";
import { useLogic } from "./logic";
import { MessageListProps, MessageListT } from "./types";
import { ChatMessageT } from "@/types";

export const MessageList = forwardRef<MessageListT, MessageListProps>(
  (props: MessageListProps, ref): JSX.Element => {
    const {
      me,
      messageSize,
      isPublic,
      chatMessages$,
      sendingMsgs,
      failedMsgs,
      lastCheckAts,
      handleErrorRetry,
      handleLoaderDetect,
      handleAppendRetry,
      handleErrorMessageRetryClick,
      handleErrorMessageCloseClick,
    } = useLogic(props, ref);

    const t = useTranslations("pages.ChatPage.ChatRoomSection.MessageList");

    const { data: chatMessages, status, appendingStatus } = chatMessages$;

    if (status == "init") {
      return (
        <Center
          width='100%'
          height='100%'
        >
          <Txt color='vague.main'>...</Txt>
        </Center>
      );
    }
    if (status == "loading") {
      return (
        <Center
          width='100%'
          height='100%'
        >
          <LoadingIndicator />
        </Center>
      );
    }
    if (status == "error") {
      return (
        <Center
          width='100%'
          height='100%'
        >
          <ErrorBox onRetry={handleErrorRetry} />
        </Center>
      );
    }

    return (
      <Col flexDirection='column-reverse'>
        {failedMsgs.map((msg) => {
          return (
            <Fragment key={msg.requestId}>
              <Row
                justifyContent='flex-end'
                alignItems='flex-end'
              >
                <Txt
                  variant='body3'
                  color='vague.light'
                >
                  {t("failed")}
                </Txt>
                <Box
                  mx={1}
                  bgcolor={red[500]}
                  borderRadius={1}
                >
                  <ButtonBase onClick={(): void => handleErrorMessageRetryClick(msg)}>
                    <RetryIcon sx={{ fontSize: 22, color: "#ffffff" }} />
                  </ButtonBase>
                  <ButtonBase onClick={(): void => handleErrorMessageCloseClick(msg)}>
                    <CloseIcon sx={{ fontSize: 22, color: "#ffffff" }} />
                  </ButtonBase>
                </Box>

                <ChatMessageBodyItem
                  message={msg.form}
                  isMine={true}
                  size={messageSize}
                />
              </Row>
            </Fragment>
          );
        })}
        {sendingMsgs.map((msg) => {
          return (
            <Fragment key={msg.requestId}>
              <Row
                justifyContent='flex-end'
                alignItems='flex-end'
              >
                <Txt
                  variant='body3'
                  color='vague.light'
                >
                  {t("sending")}
                </Txt>
                <ChatMessageBodyItem
                  message={msg.form}
                  isMine={true}
                  size={messageSize}
                />
              </Row>
            </Fragment>
          );
        })}
        <ListView
          data={chatMessages}
          renderItem={(item, idx): JSX.Element => {
            const isMine = item.sender_id == me?.id;
            let prevItem: ChatMessageT | null = null;
            let nextItem: ChatMessageT | null = null;
            if (idx > 0) {
              nextItem = chatMessages[idx - 1];
            }
            if (idx < chatMessages.length - 1) {
              prevItem = chatMessages[idx + 1];
            }
            const numUnread = lastCheckAts.filter((lca) => lca < new Date(item.created_at)).length;
            return (
              <Fragment key={item.id}>
                <ChatMessageItem
                  isPublic={isPublic}
                  message={item}
                  isMine={isMine}
                  size={messageSize}
                  nextMessage={nextItem}
                  prevMessage={prevItem}
                  numUnread={numUnread}
                />
              </Fragment>
            );
          }}
          onLoaderDetect={handleLoaderDetect}
          renderAppend={(): JSX.Element => {
            return (
              <Row
                width='100%'
                justifyContent='center'
              >
                {appendingStatus == "loading" && <AppendLoading />}
                {appendingStatus == "error" && <AppendError onRetry={handleAppendRetry} />}
              </Row>
            );
          }}
        />
      </Col>
    );
  },
);
