"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Divider, TextField, Fab, Collapse, Switch, Dialog } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { AccountIcon, PreviewIcon } from "@/ui/icons";
import { AuthorSelector } from "@/components/AuthorSelector";
import { Container, Box, Gap, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EditableTextField } from "@/ui/tools/EditableTextField";
import { FlairSection } from "./FlairSection";
import { AvatarSection } from "./AvatarSection";
import { NoRightIndicator } from "../../NoRightIndicator";
import { SectionBox } from "./style";
// logic
import { useState, ChangeEvent } from "react";
import { useSnackbar } from "@/hooks/Snackbar";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import * as BoardApi from "@/apis/boards";
import type { BoardT } from "@/types";


export function ExposureTab(): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ExposureTab");
  const boardMain$ = useBoardMain$();
  const { board, manager } = boardMain$.data!;
  const boardMainAct = useBoardMainActions();

  const { enqueueSnackbar } = useSnackbar();
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  async function updateBoard(data: Partial<BoardT>, opt: {successMsg?: string, failMsg?: string} = {}): Promise<BoardT | void> {
    try {
      const updated = await BoardApi.update(board.id, data);
      boardMainAct.patchData({ board: updated });
      enqueueSnackbar(opt.successMsg ?? t("updateSuccess"), { variant: "success" });
      return updated;
    } catch (e) {
      enqueueSnackbar(opt.failMsg ?? t("updateFailed"), { variant: "error" });
    }
  }

  function handleDefaultNicknameUpdate(val: string): void {
    updateBoard({ default_nickname: val.trim() == "" ? null : val.trim() });
  }

  function handleFlairActiveChange(e: ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    updateBoard({ use_flair: checked });
  }

  function handlePreviewOpen(): void {
    setPreviewOpen(true);
  }

  function handlePreviewClose(): void {
    setPreviewOpen(false);
  }


  const flairActive = board.use_flair;
  const { downSm } = useResponsive();

  if (!manager?.manage_contents) {
    return <NoRightIndicator title={t("userExposureSetting")} />;
  }

  return (
    <Container rtlP>
      <Txt variant='h5'>{t("userExposureSetting")}</Txt>

      <Gap y={4} />

      <Row>
        <Txt variant='h6'>{t("flairSetting")}</Txt>
        {/*
        <HelperTooltip
          tip={'유저가 \'객관식\'으로 자신이 공개하고 싶은 정보를 고르게 할 때 활용해보세요.'}
        /> */}
      </Row>
      <Divider />

      <Gap y={1} />

      <Txt color='vague.main'>{t("flairSettingHelper")}</Txt>

      <Gap y={2} />

      <SectionBox>
        <Row justifyContent='space-around'>
          <Txt variant='subtitle2'>{t("useFlair")}</Txt>
          <Switch
            checked={flairActive}
            onChange={handleFlairActiveChange}
          />
        </Row>

        <Collapse in={flairActive}>
          <FlairSection board={board} />
        </Collapse>
      </SectionBox>

      <Gap y={8} />

      <Row>
        <Txt variant='h6'>{t("defaultNickname")}</Txt>
      </Row>
      <Divider />

      <Gap y={1} />

      <Txt color='vague.main'>
        {t("defaultNicknameHelper")
        }
      </Txt>

      <Gap y={2} />

      <SectionBox>
        <Row justifyContent='center'>
          <AccountIcon
            fontSize='large'
            sx={{
              color: "vague.main",
              mr: 1,
            }}
          />
          <EditableTextField
            value={board.default_nickname ?? t("anonymous")}
            onUpdate={handleDefaultNicknameUpdate}
            label={t("defaultNickname")}
            actionLoc='right'
            renderText={(text, handleEditClick): JSX.Element => {
              return (
                <TextField
                  variant='standard'
                  value={text}
                  onFocus={(e): void => handleEditClick(e as any)}
                  InputProps={{
                    inputProps: {
                      style: { textAlign: "center" },
                    },
                  }}
                />
              );
            }}
          />
        </Row>
      </SectionBox>

      <Gap y={8} />

      <Row>
        <Txt variant='h6'> {t("defaultAvatar")}</Txt>
      </Row>
      <Divider />

      <Gap y={1} />

      <Txt color='vague.main'>{t("defaultAvatarHelper")}</Txt>

      <Gap y={2} />

      <SectionBox>
        <AvatarSection
          board={board}
          onBoardUpdate={updateBoard}
        />
      </SectionBox>

      <Box height='200px' />

      <Fab
        variant='extended'
        color='primary'
        onClick={handlePreviewOpen}
        size='medium'
        sx={{
          position: "fixed",
          bottom: downSm ? "16px" : "4vh",
          right: "4vw",
        }}
      >
        <PreviewIcon />
        <Gap x={1} />
        {t("preview")}
      </Fab>

      <Dialog
        fullWidth
        open={previewOpen}
        onClose={handlePreviewClose}
      >
        <Box p={2}>
          <AuthorSelector
            board={board}
            onApply={handlePreviewClose}
            onCancel={handlePreviewClose}
          />
        </Box>
      </Dialog>
    </Container>
  );
}
