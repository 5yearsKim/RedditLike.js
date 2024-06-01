"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Grid, IconButton, Button, TextField, Switch, Collapse } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { EditIcon, CloseIcon, AddIcon, ReorderIcon, CheckIcon } from "@/ui/icons";
import { Row, Col, Box, Expand, Gap, GridItem } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EditableTextField } from "@/ui/tools/EditableTextField";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";
import { ReorderableList } from "@/ui/tools/ReorderableList";
import { FlairItem } from "./FlairItem";
import { FlairEditor } from "@/components/FlairEditor";
import { noEmptyValidator, maxLenValidator } from "@/utils/validator";
// logic
import { useState, ChangeEvent } from "react";
import { useSnackbar } from "@/hooks/Snackbar";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { replaceItem } from "@/utils/misc";
import * as FlairBoxApi from "@/apis/flair_boxes";
import * as FlairApi from "@/apis/flairs";
import type { FlairBoxT, FlairBoxFormT, FlairT, FlairFormT } from "@/types";

type FlairBoxItemProps = {
  flairBox: FlairBoxT;
  onUpdated: (flairBox: FlairBoxT) => void;
  onDeleted: (flairBoxId: idT) => void;
};

export function FlairBoxItem({
  flairBox,
  onUpdated,
  onDeleted,
}: FlairBoxItemProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ExposureTab.FlairSection.FlairBoxItem");

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
  const [reorderedFlairs, setReorderedFlairs] = useState<FlairT[]>([]);
  // const [isMultiple, setIsMultiple] = useState<boolean>(flairBox.is_multiple ?? false);
  // const [isEditable, setIsEditable] = useState<boolean>(flairBox.is_editable ?? false);
  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();

  async function _updateItem(data: Partial<FlairBoxFormT>): Promise<FlairBoxT | void> {
    try {
      const updated = await FlairBoxApi.update(flairBox.id, data);
      onUpdated({ ...flairBox, ...updated });
      enqueueSnackbar(t("updateSuccess"), { variant: "success" });
      return updated;
    } catch (e) {
      enqueueSnackbar(t("updateFailed"), { variant: "error" });
    }
  }

  async function handleDeleteBoxClick(): Promise<void> {
    if (flairBox.flairs?.length) {
      await showAlertDialog({
        title: t("deleteFlairGroup"),
        body: t("deleteAllFlairMsg"),
        useOk: true,
      });
      return;
    }
    const isOk = await showAlertDialog({
      title: t("deleteFlairGroup"),
      body: t("deleteFlairGroupMsg"),
      useOk: true,
      useCancel: true,
    });
    if (isOk !== true) {
      return;
    }
    try {
      await FlairBoxApi.remove(flairBox.id);
      onDeleted(flairBox.id);
      enqueueSnackbar(t("deleteFlairGroupSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("deleteFlairGroupFailed"), { variant: "error" });
      console.warn(e);
    }
  }

  function handleNameUpdate(val: string): void {
    _updateItem({ name: val });
  }

  function handleDescriptionUpdate(val: string): void {
    _updateItem({ description: val });
  }

  async function handleIsMultipleChange(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const checked = e.target.checked;
    _updateItem({ is_multiple: checked });
  }

  async function handleIsEditableChange(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const checked = e.target.checked;
    _updateItem({ is_editable: checked });
  }

  // async function handleIsForceChange(e: ChangeEvent<HTMLInputElement>): Promise<void> {
  //   const checked = e.target.checked;
  //   _updateItem({ is_force: checked });
  // }

  function handleAddClick(): void {
    setAddOpen(true);
  }

  async function handleEditorCancel(flair: FlairFormT): Promise<void> {
    if (flair.label.length) {
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
    setAddOpen(false);
  }

  async function handleEditorSave(flair: FlairFormT): Promise<void> {
    try {
      await FlairApi.create(flair);
      const { data: fetched } = await FlairBoxApi.get(flairBox.id, { $flairs: true });
      setAddOpen(false);
      onUpdated(fetched);
      enqueueSnackbar(t("addFlairSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("addFlairFailed"), { variant: "error" });
    }
  }

  async function handleFlairUpdated(newFlair: FlairT): Promise<void> {
    const flairs = flairBox.flairs ?? [];
    const newFlairs = replaceItem(flairs, newFlair, (item) => item.id == newFlair.id);
    const newFlairBox = {
      ...flairBox,
      flairs: newFlairs,
    };
    onUpdated(newFlairBox);
  }

  async function handleFlairDeleted(flair: FlairT): Promise<void> {
    const flairs = flairBox.flairs ?? [];
    const newFlairs = flairs.filter((item) => item.id != flair.id);
    const newFlairBox = {
      ...flairBox,
      flairs: newFlairs,
    };
    onUpdated(newFlairBox);
  }

  function handleReorderStart(): void {
    setIsReorderMode(true);
    setReorderedFlairs(flairBox.flairs ?? []);
  }

  function handleReorderCancel(): void {
    setIsReorderMode(false);
  }

  function handleReorder(newFlairs: FlairT[]): void {
    setReorderedFlairs(newFlairs);
  }

  async function handleReorderApply(): Promise<void> {
    try {
      const newFlairs = await FlairApi.rerank(flairBox.id, reorderedFlairs.map((item) => item.id));
      onUpdated({
        ...flairBox,
        flairs: newFlairs,
      });
      enqueueSnackbar(t("reorderSuccess"), { variant: "success" });
      setIsReorderMode(false);
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("reorderFailed"), { variant: "error" });
    }
  }

  const { downSm } = useResponsive();

  return (
    <Box
      bgcolor='paper.main'
      p={2}
      borderRadius={2}
      boxShadow='0 0 8px rgba(0,0,0,0.2)'
    >
      <Row>
        <Expand>
          <EditableTextField
            value={flairBox.name}
            onUpdate={handleNameUpdate}
            actionLoc='bottom'
            label={t("groupName")}
            validators={[noEmptyValidator(), maxLenValidator(24)]}
            placeholder={t("groupNameHelper")}
            renderText={(val, handleClick): JSX.Element => {
              return (
                <Row flexWrap='wrap'>
                  <Txt variant='h6'>{val}</Txt>
                  <IconButton onClick={(e): void => handleClick(e as any)}>
                    <EditIcon />
                  </IconButton>
                </Row>
              );
            }}
          />
        </Expand>
        <IconButton onClick={handleDeleteBoxClick}>
          <CloseIcon />
        </IconButton>
      </Row>

      <Gap y={1} />

      <EditableTextField
        value={flairBox.description ?? t("flairGuide")}
        onUpdate={handleDescriptionUpdate}
        label={t("flairGuide")}
        placeholder={t("flairGuideHelper")}
        fullWidth
        multiline
        variant='standard'
        minRows={1}
        maxRows={5}
        validators={[maxLenValidator(200)]}
        renderText={(val, handleEditClick): JSX.Element => {
          return (
            <TextField
              multiline={true}
              variant='standard'
              fullWidth
              value={val}
              label={t("flairGuide")}
              InputLabelProps={{ shrink: true }}
              onFocus={(e): void => handleEditClick(e as any)}
            />
          );
        }}
      />

      <Gap y={2} />

      <Grid
        container
        rowSpacing={1}
      >
        {/* line 1 */}
        <GridItem xs={8}>
          <Row>
            <Txt variant='subtitle2'>{t("allowCustomize")}</Txt>
            <Gap x={1} />
            <HelperTooltip tip={t("allowCustomizeHelper")} />
          </Row>
        </GridItem>
        <GridItem xs={4}>
          <Switch
            checked={flairBox.is_editable}
            onChange={handleIsEditableChange}
          />
        </GridItem>

        {/* line 2 */}
        <GridItem xs={8}>
          <Txt variant='subtitle2'>{t("allowMultiple")}</Txt>
        </GridItem>
        <GridItem xs={4}>
          <Switch
            checked={flairBox.is_multiple}
            onChange={handleIsMultipleChange}
          />
        </GridItem>

        {/* line 3
        <GridItem xs={8}>
          <Row>
            <Txt variant='subtitle2'>플래그 설정 권장</Txt>
            <Gap x={1} />
            <HelperTooltip tip='유저가 해당 플래그를 설정하지 않았을 때 팝업을 띄워 설정을 권장해요.' />
          </Row>
        </GridItem>
        <GridItem xs={4}>
          <Switch
            checked={flairBox.is_force}
            onChange={handleIsForceChange}
          />
      </GridItem> */}
      </Grid>

      <Row justifyContent='flex-end'>
        {isReorderMode ? (
          <>
            <Button
              onClick={handleReorderCancel}
              size={downSm ? "small" : "medium"}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleReorderApply}
              variant='contained'
              startIcon={<CheckIcon />}
              size={downSm ? "small" : "medium"}
              disabled={flairBox.flairs === reorderedFlairs}
            >
              {t("applyOrder")}
            </Button>
          </>
        ) : (
          <>
            {Boolean(flairBox.flairs?.length) && (
              <Button
                // variant='outlined'
                startIcon={<ReorderIcon />}
                onClick={handleReorderStart}
                size={downSm ? "small" : "medium"}
              >
                {t("reorder")}
              </Button>
            )}
            <Button
              variant='contained'
              onClick={handleAddClick}
              disabled={addOpen}
              startIcon={<AddIcon />}
              size={downSm ? "small" : "medium"}
            >
              {t("addFlair")}
            </Button>
          </>
        )}
      </Row>
      <Collapse in={addOpen}>
        {addOpen && (
          <Box
            p={1}
            borderRadius={2}
            boxShadow='0 0 4px rgba(0,0,0,0.2)'
          >
            <FlairEditor
              fbid={flairBox.id}
              isManager={true}
              onSave={handleEditorSave}
              onCancel={handleEditorCancel}
            />
          </Box>
        )}
      </Collapse>

      {isReorderMode ? (
        <ReorderableList
          items={reorderedFlairs}
          renderItem={(flair): JSX.Element => {
            return (
              <Fragment key={flair.id}>
                <FlairItem
                  flair={flair}
                  onUpdated={handleFlairUpdated}
                  onDeleted={handleFlairDeleted}
                />
              </Fragment>
            );
          }}
          onReorder={handleReorder}
        />
      ) : (
        <Col alignItems='center'>
          {(flairBox.flairs ?? []).map((flair) => {
            return (
              <Fragment key={flair.id}>
                <FlairItem
                  flair={flair}
                  onUpdated={handleFlairUpdated}
                  onDeleted={handleFlairDeleted}
                />
              </Fragment>
            );
          })}
        </Col>
      )}
    </Box>
  );
}
