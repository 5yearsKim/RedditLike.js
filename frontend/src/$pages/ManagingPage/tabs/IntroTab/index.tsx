"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Divider } from "@mui/material";
import { Row, Gap, Container } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { maxLenValidator, charRemainingHelper, noEmptyValidator } from "@/utils/validator";
import { EditableTextField } from "@/ui/tools/EditableTextField";
import { DisablePointerBox } from "@/ui/tools/DisablePointerBox";
import { EditableBoardBg } from "./EditableBoardBg";
import { EditableBoardAvatar } from "./EditableBoardAvatar";
import { EditableBoardName } from "./EditableBoardName";
import { EditableTheme } from "./EditableTheme";
import { NoRightIndicator } from "../../NoRightIndicator";
// logic
import { useCallback } from "react";
import { useSnackbar } from "@/hooks/Snackbar";
import * as BoardApi from "@/apis/boards";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import type { BoardFormT } from "@/types";


export function IntroTab(): JSX.Element {
  const t = useTranslations("pages.ManagingPage.IntroTab");
  const { enqueueSnackbar } = useSnackbar();

  const boardMain$ = useBoardMain$();
  const boardMainAct = useBoardMainActions();

  const { board, manager } = boardMain$.data!;

  const _updateBoard = useCallback(async (form: Partial<BoardFormT>, opt: {successMsg?:string, failMsg?:string} = {} ) => {
    try {
      const updated = await BoardApi.update(board.id, form);
      boardMainAct.patchData({ board: updated });

      enqueueSnackbar( opt.successMsg ?? t("updateSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar( opt.failMsg ?? t("updateFailed"), { variant: "error" });
    }
  }, []);

  async function handleBgUpdate(bgPath: string | null): Promise<void> {
    const form: Partial<BoardFormT> = { bg_path: bgPath };
    await _updateBoard(form, { successMsg: t("bgUpdateSuccess"), failMsg: t("bgUpdateFailed") });
  }

  async function handleAvatarUpdate(avatarPath: string | null): Promise<void> {
    const form: Partial<BoardFormT> = { avatar_path: avatarPath };
    await _updateBoard(form, { successMsg: t("avatarUpdateSuccess"), failMsg: t("avatarUpdateFailed") });

  }

  async function handleBoardNameUpdate(name: string): Promise<void> {
    const form: Partial<BoardFormT> = { name };
    await _updateBoard(form, { successMsg: t("nameUpdateSuccess"), failMsg: t("nameUpdateFailed") });
  }

  async function handleBoardDescriptionUpdate(description: string): Promise<void> {
    const form: Partial<BoardFormT> = { description };
    await _updateBoard(form, { successMsg: t("descriptionUpdateSuccess"), failMsg: t("descriptionUpdateFailed") });
  }

  async function handleThemeColorUpdate(themeColor: string | null): Promise<void> {
    const form: Partial<BoardFormT> = {
      theme_color: themeColor,
    };
    await _updateBoard(form, { successMsg: t("themeColorUpdateSuccess"), failMsg: t("themeColorUpdateFailed") });
  }

  async function handleThemeActiveUpdate(isActive: boolean): Promise<void> {
    const form: Partial<BoardFormT> = { use_theme: isActive };
    await _updateBoard(form);
  }

  const isViewer = !Boolean(manager?.manage_intro);

  if (!manager?.manage_intro) {
    return <NoRightIndicator title={t("introPage")}/>;
  }

  return (
    <DisablePointerBox blockPointer={isViewer}>
      <EditableBoardBg
        board={board}
        onUpdated={handleBgUpdate}
      />

      <Container sx={{ paddingLeft: "8px", paddingRight: "8px" }}>
        <Row>
          <Gap x={2} />
          <EditableBoardAvatar
            board={board}
            onUpdated={handleAvatarUpdate}
          />
          <Gap x={3} />
          <EditableBoardName
            name={board.name}
            onUpdated={handleBoardNameUpdate}
          />
          {isViewer && <Txt color='vague.main'>({t("noEditRight")})</Txt>}
        </Row>

        <Gap y={3} />

        <EditableTextField
          txtProps={{ variant: "body1" }}
          value={board.description ?? ""}
          label={t("boardDescription")}
          multiline={true}
          validators={[noEmptyValidator(), maxLenValidator(200)]}
          helpers={[charRemainingHelper(200)]}
          minRows={3}
          maxRows={8}
          actionLoc="bottom"
          onUpdate={handleBoardDescriptionUpdate}
        />

        <Gap y={3} />

        <Txt
          variant='subtitle1'
          color='vague.main'
        >
          {t("themeColor")}
        </Txt>
        <Divider />

        <Gap y={1} />

        <EditableTheme
          themeActive={board.use_theme ?? false}
          themeColor={board.theme_color ?? undefined}
          onUpdateColor={handleThemeColorUpdate}
          onUpdateActive={handleThemeActiveUpdate}
        />
      </Container>
    </DisablePointerBox>
  );
}
