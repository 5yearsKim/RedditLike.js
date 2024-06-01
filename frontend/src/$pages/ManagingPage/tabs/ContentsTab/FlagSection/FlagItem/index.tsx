"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Collapse, Box, IconButton } from "@mui/material";
import { Tooltip } from "@/ui/tools/Tooltip";
import { Flag } from "@/components/Flag";
import { ManagerIcon, EditIcon, DeleteIcon } from "@/ui/icons";
import { Row, Gap } from "@/ui/layouts";
import { FlagEditor } from "@/components/FlagEditor";
// logic
import { useState } from "react";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import * as FlagApi from "@/apis/flags";
import type { FlagT, FlagFormT } from "@/types";


type FlagItemProps = {
  flag: FlagT;
  onUpdated: (updated: FlagT) => void;
  onDeleted: (deleted: FlagT) => void;
};

export function FlagItem({
  flag,
  onUpdated,
  onDeleted,
}: FlagItemProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ContentsTab.FlagSection.FlagItem");

  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  function handleEditClick(): void {
    setEditorOpen(true);
  }

  async function handleEditorCancel(newFlag: FlagFormT): Promise<void> {
    if (newFlag.label !== flag.label) {
      const isOk = await showAlertDialog({
        title: t("cancelFlag"),
        body: t("cancelFlagMsg"),
        useOk: true,
        useCancel: true,
      });
      if (isOk !== true) {
        return;
      }
    }
    setEditorOpen(false);
  }

  async function handleEditorSave(newFlag: FlagFormT): Promise<void> {
    try {
      const updated = await FlagApi.update(flag.id, newFlag);
      onUpdated(updated);
      setEditorOpen(false);
      enqueueSnackbar(t("editFlagSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("editFlagFailed"), { variant: "error" });
    }
  }

  async function handleDeleteClick(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("deleteFlag"),
      body: t("deleteFlagMsg"),
      useCancel: true,
      useOk: true,
    });
    if (isOk === true) {
      try {
        const deleted = await FlagApi.remove(flag.id);
        if (deleted) {
          onDeleted(deleted);
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }

  return (
    <Fragment>
      <Collapse in={!editorOpen}>
        <Row justifyContent='center'>
          <Box
            minWidth='80px'
            display='flex'
            justifyContent='center'
          >
            <Flag
              flag={flag}
              showTip
            />
            {flag.manager_only && (
              <Tooltip title={t("managerOnly")}>
                <ManagerIcon color='primary' />
              </Tooltip>
            )}
          </Box>

          <Gap x={2} />

          <Tooltip
            title={t("edit")}
            disabled={editorOpen}
          >
            <IconButton
              size='small'
              onClick={handleEditClick}
              disabled={editorOpen}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("delete")}>
            <IconButton
              size='small'
              onClick={handleDeleteClick}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Row>
      </Collapse>

      <Collapse in={editorOpen}>
        <Box
          p={1}
          borderRadius={2}
          boxShadow='0 0 4px rgba(0,0,0,0.2)'
        >
          <FlagEditor
            boardId={flag.board_id}
            preFlag={flag}
            onSave={(flag): Promise<void> => handleEditorSave(flag)}
            onCancel={(flag): Promise<void> => handleEditorCancel(flag)}
          />
        </Box>
      </Collapse>
    </Fragment>
  );
}
