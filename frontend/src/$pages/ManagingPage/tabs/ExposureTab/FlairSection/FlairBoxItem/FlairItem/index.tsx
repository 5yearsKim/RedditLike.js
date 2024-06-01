"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { IconButton, Collapse, Box } from "@mui/material";
import { Tooltip } from "@/ui/tools/Tooltip";
import { Flair } from "@/components/Flair";
import { EditIcon, DeleteIcon, ManagerIcon } from "@/ui/icons";
import { FlairEditor } from "@/components/FlairEditor";
import { Row, Gap } from "@/ui/layouts";
// logic
import { useState } from "react";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import * as FlairApi from "@/apis/flairs";
import type { FlairT, FlairFormT } from "@/types";

type FlairItemProps = {
  flair: FlairT;
  onUpdated: (updated: FlairT) => void;
  onDeleted: (deleted: FlairT) => void;
};

export function FlairItem({
  flair,
  onUpdated,
  onDeleted,
}: FlairItemProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ExposureTab.FlairSection.FlairBoxItem.FlairItem");
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  function handleEditClick(): void {
    setEditorOpen(true);
  }

  async function handleEditorCancel(newFlair: FlairFormT): Promise<void> {
    if (newFlair.label !== flair.label) {
      const isOk = await showAlertDialog({
        title: t("cancelFlair"),
        body: t("cancelFlairMsg"),
        useOk: true,
        useCancel: true,
      });
      if (isOk !== true) {
        return;
      }
    }
    setEditorOpen(false);
  }

  async function handleEditorSave(newFlair: FlairFormT): Promise<void> {
    try {
      const updated = await FlairApi.update(flair.id, newFlair);
      if (updated) {
        onUpdated(updated);
        setEditorOpen(false);
        enqueueSnackbar(t("updateSuccess"), { variant: "success" });
      }
    } catch (e) {
      enqueueSnackbar(t("updateFailed"), { variant: "error" });
    }
  }

  async function handleDeleteClick(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("deleteFlair"),
      body: t("deleteFlairMsg"),
      useCancel: true,
      useOk: true,
    });
    if (isOk === true) {
      try {
        const deleted = await FlairApi.remove(flair.id);
        if (deleted) {
          onDeleted(deleted);
          enqueueSnackbar(t("deleteFlairSuccess"), { variant: "success" });
        }
      } catch (e) {
        enqueueSnackbar(t("deleteFlairFailed"), { variant: "error" });
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
            <Flair
              size='md'
              flair={flair}
            />
          </Box>

          <Gap x={2} />

          {flair.manager_only && (
            <Tooltip title={t("managerOnly")}>
              <ManagerIcon
                color='primary'
                sx={{ m: 1, cursor: "pointer" }}
              />
            </Tooltip>
          )}
          <Tooltip title={t("edit")}>
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
          <FlairEditor
            fbid={flair.box_id}
            isManager={true}
            preFlair={flair}
            onSave={(flair): Promise<void> => handleEditorSave(flair)}
            onCancel={(flair): Promise<void> => handleEditorCancel(flair)}
          />
        </Box>
      </Collapse>
    </Fragment>
  );
}
