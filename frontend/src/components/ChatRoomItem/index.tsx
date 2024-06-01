import React, { useMemo, MouseEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Avatar, Box, Badge } from "@mui/material";
import { Row, Col, Expand } from "@/ui/layouts";
import { Txt, EllipsisTxt } from "@/ui/texts";
import { Clickable } from "@/ui/tools/Clickable";
import { BoardNameItem } from "@/components/BoardNameItem";
import { useMe } from "@/stores/UserStore";
import { vizTime } from "@/utils/time";
import type { ChatRoomT, AuthorT } from "@/types";
import { buildImgUrl } from "@/utils/media";

type ChatRoomItemProps = {
  chatRoom: ChatRoomT;
  onClick: (e: MouseEvent<HTMLElement>) => void;
};

export function ChatRoomItem({
  chatRoom,
  onClick,
}: ChatRoomItemProps): JSX.Element {
  const t = useTranslations("components.ChatRoomItem");
  const locale = useLocale();
  const me = useMe();

  let opponent: AuthorT | null = chatRoom.opponent ?? null;
  if (opponent?.deleted_at) {
    opponent = null;
  }

  const isIsolated = useMemo(() => {
    const participants = chatRoom.participants ?? [];
    if (participants.length == 1 && participants[0].user_id == me?.id) {
      return true;
    }
    return false;
  }, []);

  return (
    <Clickable onClick={onClick}>
      <Box
        my={0.5}
        width='100%'
      >
        <Row>
          <Avatar
            src={opponent?.avatar_path ?
              buildImgUrl(null, opponent.avatar_path, { size: "xxs" }) :
              opponent?.default_avatar_path ?
                buildImgUrl(null, opponent.default_avatar_path, { size: "xxs" })
                : undefined
            }
            sx={{
              fontSize: 30,
              userSelect: "none",
              pointerEvents: "none",
              marginRight: 1,
              marginLeft: 1,
            }}
          />
          <Col width='100%'>
            <Row height='22px'>
              {opponent ? (
                <Txt
                  variant='body2'
                  fontWeight={700}
                >
                  {opponent.nickname ?? opponent.default_nickname ?? "익명"}
                </Txt>
              ) : (
                <Txt
                  variant='body2'
                  color='vague.light'
                >
                  ({t("unknown")})
                </Txt>
              )}
              <Expand />
              {chatRoom.board && (
                <Box style={{ transform: "scale(0.8)" }}>
                  <BoardNameItem
                    board={chatRoom.board}
                    disabled
                  />
                </Box>
              )}
            </Row>
            <Row maxWidth='100%'>
              <Expand>
                {isIsolated ? (
                  <Txt
                    variant='body3'
                    color='vague.main'
                  >
                    ({t("leftRoom")})
                  </Txt>
                ) : (
                  <Box maxWidth='200px'>
                    <EllipsisTxt
                      maxLines={1}
                      variant='body3'
                      color='vague.main'
                    >
                      {chatRoom?.last_message?.body ?? ""}
                    </EllipsisTxt>
                  </Box>
                )}
              </Expand>

              <Badge
                color='secondary'
                badgeContent={chatRoom.unread_cnt ?? 0}
              />

              <Box
                ml={2}
                mr={2}
              >
                <Txt
                  variant='body3'
                  color='vague.main'
                >
                  {vizTime(chatRoom.last_message_at, { type: "relative", locale })}
                </Txt>
              </Box>
            </Row>
          </Col>
        </Row>
      </Box>
    </Clickable>
  );
}
