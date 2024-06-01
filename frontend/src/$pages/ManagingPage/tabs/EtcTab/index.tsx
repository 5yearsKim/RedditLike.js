"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Divider, Switch } from "@mui/material";
import { Container, Gap, Expand, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { NoRightIndicator } from "../../NoRightIndicator";
import { CategorySelectSection } from "./CategorySelectSection";
import { LiveChatFab } from "./LiveChatFab";
// logic
import { useState, useEffect, ChangeEvent } from "react";
import { useSnackbar } from "@/hooks/Snackbar";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import * as ChatRoomApi from "@/apis/chat_rooms";
import * as BoardApi from "@/apis/boards";
import type { BoardFormT, ChatRoomT } from "@/types";


export function EtcTab(): JSX.Element {
  const t = useTranslations("pages.ManagingPage.EtcTab");
  const { enqueueSnackbar } = useSnackbar();
  const boardMain$ = useBoardMain$();
  const boardMainAct = useBoardMainActions();

  const [chatRoom, setChatRoom] = useState<ChatRoomT | null>(null);

  const { board, manager } = boardMain$.data!;

  const _fetchChatRoom = async (): Promise<void> => {
    try {
      const { data: fetched } = await ChatRoomApi.list({
        boardId: board.id,
        public: "only",
        $board: true,
      });
      if (fetched.length > 0) {
        setChatRoom(fetched[0]);
      } else {
        setChatRoom(null);
      }
    } catch (e) {
      console.warn("fetch chat room error", e);
    }
  };

  useEffect(() => {
    if (board.use_public_chat) {
      _fetchChatRoom();
    } else {
      setChatRoom(null);
    }
  }, [board.use_public_chat]);

  async function updateBoard(data: Partial<BoardFormT>): Promise<void> {
    try {
      const updated = await BoardApi.update(board.id, data);
      boardMainAct.patchData({ board: updated });
      enqueueSnackbar( t("updateSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("updateFailed"), { variant: "error" });
    }
  }

  async function handleUsePublicChatChange(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const checked = e.target.checked;
    if (checked) {
      try {
        await ChatRoomApi.initBoard(board.id);
      } catch (e: any) {
        console.warn(e);
      }
    }
    updateBoard({ use_public_chat: checked });
  }


  if (!manager?.manage_etc) {
    return <NoRightIndicator title={t("etcSetting")} />;
  }
  return (
    <Container rtlP>
      <Txt variant='h5'>{t("etcSetting")}</Txt>

      <Gap y={4} />

      <Txt variant='h6'>{t("liveChat")}</Txt>
      <Divider />

      <Gap y={1} />

      <Txt color='vague.main'>{t("liveChatHelper")}</Txt>

      <Gap y={1} />

      <Row maxWidth={400} mx='auto'>
        <Txt variant='subtitle2'>{t("liveChat")}</Txt>

        <Expand/>

        <Row>
          {chatRoom && <LiveChatFab chatRoom={chatRoom} />}
          <Switch
            checked={board.use_public_chat ?? false}
            onChange={handleUsePublicChatChange}
          />
        </Row>
      </Row>


      <Gap y={4} />

      <Txt variant='h6'>{t("categorySetting")}</Txt>
      <Divider />

      <Gap y={1} />

      <Txt color='vague.main'>{t("categorySettingHelper")}</Txt>

      <Gap y={1} />

      <Row maxWidth={400} mx='auto'>
        <Txt variant='subtitle2'>{t("category")}</Txt>
        <Expand/>
        <CategorySelectSection board={board} />
      </Row>
    </Container>
  );
}
