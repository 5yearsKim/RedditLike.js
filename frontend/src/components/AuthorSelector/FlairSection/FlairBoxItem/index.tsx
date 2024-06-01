"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";

import { IconButton, Button, Checkbox, Collapse } from "@mui/material";
import { Tooltip } from "@/ui/tools/Tooltip";
import { DeleteIcon, AddIcon } from "@/ui/icons";
import { Row, Gap, Box } from "@/ui/layouts";
import { Flair } from "@/components/Flair";
import { FlairEditor } from "@/components/FlairEditor";
// logic
import { useState, useMemo, MouseEvent } from "react";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import * as FlairApi from "@/apis/flairs";
import * as FlairBoxApi from "@/apis/flair_boxes";
import type { FlairT, FlairFormT, FlairBoxT } from "@/types";


type FlairBoxItemProps = {
  isManager?: boolean;
  selected: FlairT[];
  box: FlairBoxT;
  onFlairSelect: (flair: FlairT, box: FlairBoxT) => any;
  onBoxUpdated: (box: FlairBoxT) => any;
};

export function FlairBoxItem({
  isManager,
  selected,
  box,
  onFlairSelect,
  onBoxUpdated,
}: FlairBoxItemProps): JSX.Element {
  const t = useTranslations("components.AuthorSelector.FlairSection.FlairBoxItem");
  const [addEditorOpen, setAddEditorOpen] = useState<boolean>(false);
  const { showAlertDialog } = useAlertDialog();

  const flairCands = useMemo(() => {
    if (isManager) {
      return box.flairs ?? [];
    } else {
      return (box.flairs ?? []).filter((item) => item.manager_only !== true);
    }
  }, []);

  function handleFlairClick(flair: FlairT): void {
    onFlairSelect(flair, box);
  }

  function handleCustomAddButtonClick(): void {
    setAddEditorOpen(true);
  }

  async function handleFlairDeleteClick(e: MouseEvent<HTMLButtonElement>, flair: FlairT): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    const isOk = await showAlertDialog({
      title: t("deleteFlair"),
      body: t("deleteFlairMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await FlairApi.removeCustom(flair.id);
      const { data: fetched } = await FlairBoxApi.get(box.id, { $flairs: true, $custom_flairs: true });
      onBoxUpdated(fetched);
    } catch (e) {
      console.warn(e);
    }
  }

  async function handleAddEditorSave(form: FlairFormT): Promise<void> {
    try {
      await FlairApi.createCustom(form);
      const { data: fetched } = await FlairBoxApi.get(box.id, { $flairs: true, $custom_flairs: true });
      onBoxUpdated(fetched);
      setAddEditorOpen(false);
    } catch (e) {
      console.warn(e);
    }
  }

  async function handleAddEditorCancel(form: FlairFormT): Promise<void> {
    if (form.label) {
      const isOk = await showAlertDialog({
        title: t("cancelFlair"),
        body: t("cancelFlairMsg"),
        useOk: true,
        useCancel: true,
      });
      if (isOk === true) {
        setAddEditorOpen(false);
      }
    } else {
      setAddEditorOpen(false);
    }
  }

  return (
    <Fragment>
      {flairCands.map((flair) => {
        const idx = selected.findIndex((item) => item.id == flair.id);
        const checked = idx >= 0;
        return (
          <Row
            key={flair.id}
            justifyContent='center'
            onClick={(): void => handleFlairClick(flair)}
          >
            <Checkbox
              size='small'
              checked={checked}
            />
            <Gap x={2} />
            <Box
              minWidth='100px'
              display='flex'
              justifyContent='center'
            >
              <Flair
                size='md'
                flair={flair}
              />
            </Box>
          </Row>
        );
      })}

      {box.is_editable && (
        <Fragment>
          <Row justifyContent='flex-end'>
            <Button
              size='small'
              startIcon={<AddIcon />}
              onClick={handleCustomAddButtonClick}
              disabled={addEditorOpen}
            >
              {t("addFlair")}
            </Button>
          </Row>

          <Collapse in={addEditorOpen}>
            <Box
              p={2}
              borderRadius={2}
              minHeight={150} // height for collaps animation
              boxShadow='0 0 4px rgba(0,0,0,0.2)'
            >
              {addEditorOpen && (
                <FlairEditor
                  fbid={box.id}
                  onSave={handleAddEditorSave}
                  onCancel={handleAddEditorCancel}
                />
              )}
            </Box>
          </Collapse>

          {(box.custom_flairs ?? []).map((flair) => {
            const idx = selected.findIndex((item) => item.id == flair.id);
            const checked = idx >= 0;
            return (
              <Row
                key={flair.id}
                justifyContent='center'
                onClick={(): void => handleFlairClick(flair)}
              >
                <Checkbox
                  size='small'
                  checked={checked}
                />
                <Gap x={2} />
                <Box
                  minWidth='60px'
                  display='flex'
                  justifyContent='center'
                >
                  <Flair
                    size='md'
                    flair={flair}
                  />
                </Box>
                <Gap x={2} />
                <Tooltip title={t("delete")}>
                  <IconButton
                    aria-label='delete-button'
                    size='small'
                    onClick={(e): Promise<void> => handleFlairDeleteClick(e, flair)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Row>
            );
          })}
        </Fragment>
      )}
    </Fragment>
  );
}
