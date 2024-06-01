"use client";

import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Box, Divider, Switch, Collapse } from "@mui/material";
import { Container, Expand, Gap, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { FlagSection } from "./FlagSection";
import { SectionBox } from "./style";
// logic
import { HelperTooltip } from "@/ui/tools/HelperTooltip";

import * as BoardApi from "@/apis/boards";
// import * as FlagApi from "@/apis/flags";

import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import { ChangeEvent } from "react";
import { useSnackbar } from "@/hooks/Snackbar";
import type { BoardFormT, FlagT } from "@/types";


export function ContentsTab(): ReactNode {
  const t = useTranslations("pages.ManagingPage.ContentsTab");
  const { enqueueSnackbar } = useSnackbar();

  const boardMain$ = useBoardMain$();
  const boardMainAct = useBoardMainActions();

  const { board, manager, flags } = boardMain$.data!;

  async function updateBoard(data: Partial<BoardFormT>): Promise<void> {
    try {
      const updated = await BoardApi.update(board.id, data);
      boardMainAct.patchData({ board: updated });
      enqueueSnackbar(t("updateSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("updateFailed"), { variant: "error" });
    }
  }

  function handleAllowPostManagerOnlyChange(e: ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    updateBoard({ allow_post_manager_only: checked });
  }

  function handleFlagActiveChange(e: ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    updateBoard({ use_flag: checked });
  }

  function handleNsfwChange(e: ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    updateBoard({ use_nsfw: checked });
  }

  function handleSpoilerChange(e: ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    updateBoard({ use_spoiler: checked });
  }
  function handleFlagsUpdated(newFlags: FlagT[]): void {
    boardMainAct.patchData({ flags: newFlags });
  }


  const allowPostManagerOnly = board.allow_post_manager_only ?? false;
  const flagActive = board.use_flag ?? false;
  const nsfwActive = board.use_nsfw ?? false;
  const spoilerActive = board.use_spoiler ?? false;

  return (
    <Container rtlP>
      <Txt variant='h5'>{t("contentSetting")}</Txt>

      <Gap y={4} />

      {manager?.manage_etc && (
        <>
          <Row>
            <Txt variant='h6'>{t("allowPost")}</Txt>
          </Row>
          <Divider />

          <Gap y={2} />

          <SectionBox>
            <Row justifyContent='space-around'>
              <Txt variant='subtitle2'>{t("postManagerOnly")}</Txt>
              <Gap x={1} />
              <HelperTooltip tip={t("postManagerOnlyHelper")} />
              <Expand />
              <Switch
                checked={allowPostManagerOnly}
                onChange={handleAllowPostManagerOnlyChange}
              />
            </Row>
          </SectionBox>

          <Gap y={2} />
        </>
      )}

      <Gap y={4}/>

      {manager?.manage_contents && (
        <>
          <Row>
            <Txt variant='h6'>{t("flagSetting")}</Txt>
          </Row>
          <Divider />

          <Gap y={1} />

          <Txt color='vague.main'>{t("flagSettingHelper")}</Txt>

          <Gap y={2} />

          <SectionBox>
            <Row justifyContent='space-around'>
              <Txt variant='subtitle2'>{t("useFlag")}</Txt>
              <Switch
                checked={flagActive}
                onChange={handleFlagActiveChange}
              />
            </Row>

            <Gap y={2} />

            <Collapse in={flagActive}>
              <Box
                bgcolor='paper.main'
                p={2}
                borderRadius={2}
                boxShadow='0 0 8px rgba(0,0,0,0.2)'
              >
                <FlagSection
                  board={board}
                  flags={flags}
                  updateBoard={updateBoard}
                  onFlagsUpdated={handleFlagsUpdated}
                />
              </Box>
            </Collapse>
          </SectionBox>
        </>
      )}

      <Gap y={4}/>

      {manager?.manage_etc && (
        <>
          <Row>
            <Txt variant='h6'>{t("postOption")}</Txt>
          </Row>
          <Divider />

          <Gap y={1} />

          <Txt color='vague.main'>
            {
              t("postOptionHelper",)
            }{" "}
          </Txt>

          <Gap y={2} />

          <SectionBox>
            <Row justifyContent='space-around'>
              <Txt variant='subtitle2'>{t("useNsfw")}</Txt>
              <Switch
                checked={nsfwActive}
                onChange={handleNsfwChange}
              />
            </Row>

            <Gap y={1} />

            <Row justifyContent='space-around'>
              <Txt variant='subtitle2'>{t("useSpoiler")}</Txt>
              <Switch
                checked={spoilerActive}
                onChange={handleSpoilerChange}
              />
            </Row>
          </SectionBox>
        </>
      )}
      <Box mt={20} />
    </Container>
  );
}
