"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Grid, Switch, Box, Button, Collapse } from "@mui/material";
import { AddIcon } from "@/ui/icons";
import { GridItem, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { FlagEditor } from "@/components/FlagEditor";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";
import { FlagItem } from "./FlagItem";
// logic
import { useState, ChangeEvent } from "react";
import * as FlagApi from "@/apis/flags";

import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { replaceItem } from "@/utils/misc";
import type { BoardT, BoardFormT, FlagT, FlagFormT } from "@/types";


type FlagSectionProps = {
  board: BoardT
  flags: FlagT[]
  updateBoard: (data: Partial<BoardFormT>) => any;
  onFlagsUpdated: (flags: FlagT[]) => void;
};

export function FlagSection({
  board,
  flags,
  updateBoard,
  onFlagsUpdated,
}: FlagSectionProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ContentsTab.FlagSection");

  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const [addEditorOpen, setAddEditorOpen] = useState<boolean>(false);

  function handleAddEditorOpen(): void {
    setAddEditorOpen(true);
  }

  function handleAllowMultipleChange(e: ChangeEvent<HTMLInputElement>): void {
    updateBoard({ allow_multiple_flag: e.target.checked });
  }

  function handleForceFlagChange(e: ChangeEvent<HTMLInputElement>): void {
    updateBoard({ force_flag: e.target.checked });
  }

  async function handleAddEditorCancel(flag: FlagFormT): Promise<void> {
    if (flag.label) {
      const isOk = await showAlertDialog({
        title: t("deleteFlag"),
        body: t("deleteFlagMsg"),
        useCancel: true,
        useOk: true,
      });
      if (!isOk) {
        return;
      }
      setAddEditorOpen(false);
    } else {
      setAddEditorOpen(false);
    }
  }

  async function handleAddEditorSave(flag: FlagFormT): Promise<void> {
    try {
      const created = await FlagApi.create(flag);
      onFlagsUpdated([...flags, created]);

      enqueueSnackbar(t("flagAddSuccess"), { variant: "success" });
      setAddEditorOpen(false);
    } catch (e) {
      enqueueSnackbar(t("flagAddFailed"), { variant: "error" });
    }
  }

  function handleFlagUpdated(flag: FlagT): void {
    const newFlags = replaceItem(flags, flag, (item) => item.id == flag.id);
    onFlagsUpdated(newFlags);
  }

  // eslint-disable-next-line
  function handleFlagDeleted(flag: FlagT): void {
    const newFlags = flags.filter((item) => item.id !== flag.id);
    onFlagsUpdated(newFlags);
  }

  return (
    <Fragment>
      <Grid
        container
        rowSpacing={1}
      >
        <GridItem xs={8}>
          <Row>
            <Txt variant='subtitle2'>{t("forceFlag")}</Txt>
            <Box mr={0.5} />
            <HelperTooltip tip={t("forceFlagHelper")} />
          </Row>
        </GridItem>
        <GridItem xs={4}>
          <Switch
            checked={board.force_flag}
            onChange={handleForceFlagChange}
          />
        </GridItem>
        <GridItem xs={8}>
          <Txt variant='subtitle2'>{t("allowMultiple")}</Txt>
        </GridItem>
        <GridItem xs={4}>
          <Switch
            checked={board.allow_multiple_flag}
            onChange={handleAllowMultipleChange}
          />
        </GridItem>
      </Grid>

      <Row justifyContent='flex-end'>
        <Button
          onClick={handleAddEditorOpen}
          // variant='outlined'
          startIcon={<AddIcon />}
        >
          {t("addFlag")}
        </Button>
      </Row>

      <Gap y={1} />

      <Collapse in={addEditorOpen}>
        {addEditorOpen && (
          <Box
            p={1}
            borderRadius={2}
            boxShadow='0 0 4px rgba(0,0,0,0.2)'
          >
            <FlagEditor
              boardId={board.id}
              onSave={handleAddEditorSave}
              onCancel={handleAddEditorCancel}
            />
          </Box>
        )}
      </Collapse>
      {flags.map((flag) => {
        return (
          <FlagItem
            key={flag.id}
            flag={flag}
            onDeleted={handleFlagDeleted}
            onUpdated={handleFlagUpdated}
          />
        );
      })}
    </Fragment>
  );
}
