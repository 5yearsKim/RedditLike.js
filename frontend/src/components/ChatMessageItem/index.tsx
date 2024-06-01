import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Row, Col, Box, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { AuthorAvatar } from "@/ui/tools/Avatar";
import { CalendarIcon } from "@/ui/icons";
import { extractNameFromAuthor } from "@/components/BoardAuthor";
import { Flair } from "@/components/Flair";
import { indigo, amber } from "@mui/material/colors";
import { differenceInMinutes } from "date-fns";
import { vizTime, vizDate } from "@/utils/time";
import { getPublicMessageColor } from "./utils";
import type { ChatMessageT, ChatMessageFormT, FlairT } from "@/types";

type ChatMessageItemProps = {
  isPublic: boolean;
  message: ChatMessageT;
  isMine: boolean;
  size?: "small" | "medium";
  prevMessage: ChatMessageT | null;
  nextMessage: ChatMessageT | null;
  numUnread?: number;
};


export const ChatMessageItem = React.memo(_ChatMessageItem);

function _ChatMessageItem({
  isPublic,
  message,
  isMine,
  size,
  prevMessage: pMsg,
  nextMessage: nMsg,
  numUnread,
}: ChatMessageItemProps): JSX.Element {
  const locale = useLocale();

  function renderTime(): JSX.Element {
    const msgTime = vizTime(message.created_at, { type: "chat", locale });
    if (
      nMsg &&
      nMsg.sender_id == message.sender_id &&
      msgTime == vizTime(nMsg.created_at, { type: "chat", locale })
    ) {
      return <></>;
    }

    return (
      <Box mx={0.5}>
        <Txt
          variant='body3'
          color='vague.light'
        >
          {msgTime}
        </Txt>
      </Box>
    );
  }

  function renderDate(): JSX.Element {
    const msgDate = vizDate(message.created_at, { type: "short", locale });
    if (pMsg && msgDate == vizDate(pMsg.created_at, { type: "short", locale })) {
      return <></>;
    }
    return (
      <Row
        justifyContent='center'
        mt={2}
      >
        <CalendarIcon sx={{ color: "vague.main", fontSize: 22 }} />

        <Gap x={0.5} />

        <Txt
          variant='body2'
          color='vague.main'
        >
          {msgDate}
        </Txt>
      </Row>
    );
  }

  const prevTimeDiff = pMsg
    ? differenceInMinutes(new Date(message.created_at), new Date(pMsg.created_at))
    : 200;

  const hideAuthor = pMsg?.sender_id == message.sender_id && prevTimeDiff < 5;

  return (
    <Col
      width='100%'
      position='relative'
    >
      {renderDate()}
      <AuthorContainer
        isPublic={isPublic}
        isMine={isMine}
        message={message}
        hidden={hideAuthor}
      >
        <Row
          flexDirection={isMine ? "row-reverse" : "row"}
          alignItems='flex-end'
          width={isMine ? "100%" : "calc(100% - 60px)"}
        >
          <ChatMessageBodyItem
            message={message}
            isMine={isMine}
            isPublic={isPublic}
            size={size ?? "medium"}
          />
          {renderTime()}
          {Boolean(numUnread) && (
            <Txt
              variant='body3'
              color={amber[500]}
            >
              {numUnread}
            </Txt>
          )}
        </Row>
      </AuthorContainer>
    </Col>
  );
}

type ChatMessageBodyItemProps = {
  message: ChatMessageFormT;
  size?: "small" | "medium";
  isMine: boolean;
  isPublic?: boolean;
};

export function ChatMessageBodyItem(props: ChatMessageBodyItemProps): JSX.Element {
  const { message, size, isMine, isPublic } = props;

  return (
    <Box
      px={1}
      py={0.2}
      my={0.2}
      borderRadius={1.5}
      bgcolor={
        isMine ? indigo[700] : isPublic ? getPublicMessageColor(message.sender_id) : amber[100]
      }
      color={isMine ? "#ffffff" : "#000000"}
      maxWidth='min(70%, 300px)'
      sx={{
        borderTopRightRadius: isMine ? 0 : undefined,
        borderTopLeftRadius: isMine ? undefined : 0,
      }}
    >
      <Txt
        variant={size == "small" ? "body2" : "body1"}
        sx={{ overflowWrap: "break-word", whiteSpace: "pre-wrap" }}
      >
        {message.body}
      </Txt>
    </Box>
  );
}

type AuthorContainerProps = {
  isPublic: boolean;
  isMine: boolean;
  hidden: boolean;
  message: ChatMessageT;
  children: JSX.Element;
};

export function AuthorContainer({
  isPublic,
  isMine,
  hidden,
  message,
  children,
}: AuthorContainerProps) {
  const t = useTranslations("components.ChatMessageItem");

  if (isMine) {
    return children;
  }

  const sender = message.sender;

  if (hidden) {
    return (
      <Row>
        <Box mr={5.5} />
        {children}
      </Row>
    );
  }

  return (
    <Row
      mt={1}
      alignItems='flex-start'
    >
      <AuthorAvatar
        author={sender ?? null}
        size={35}
      />
      <Gap x={1} />
      <Col width='100%'>
        { sender &&
          <Row alignItems='center'>
            <Txt
              variant='body3'
              fontWeight={500}
            >
              {extractNameFromAuthor(sender, t("anonymous"))}
            </Txt>

            {Boolean(sender.flairs?.length) && (
              <Row
                flexWrap='wrap'
                columnGap={0.5}
                ml={0.2}
              >
                {sender.flairs.map((flair: FlairT) => {
                  return (
                    <Flair
                      key={flair.id}
                      flair={flair}
                      size='sm'
                    />
                  );
                })}
              </Row>
            )}

            {isPublic && !sender.nickname && (
              <Row alignSelf='flex-start'>
                <Box mr={0.5} />
                <Box
                  fontSize='10px'
                  color='vague.light'
                >
                  #{sender.temp_id}
                </Box>
              </Row>
            )}
          </Row>
        }
        {children}
      </Col>
    </Row>
  );
}
