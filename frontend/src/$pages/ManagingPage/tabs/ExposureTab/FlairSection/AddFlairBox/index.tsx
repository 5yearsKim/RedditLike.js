"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button, Dialog, TextField } from "@mui/material";
import { AddIcon } from "@/ui/icons";
import { Row, Col, Box, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
// logic
import { useState, ChangeEvent } from "react";
import { noEmptyValidator, maxLenValidator } from "@/utils/validator";
import { useTextForm } from "@/hooks/TextForm";
import { useSnackbar } from "@/hooks/Snackbar";
import * as FlairBoxApi from "@/apis/flair_boxes";
import { BoardT, FlairBoxFormT } from "@/types";


type AddFlairBoxProps = {
  board: BoardT;
  onCreated: () => void;
};

export function AddFlairBox({
  board,
  onCreated,
}: AddFlairBoxProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ExposureTab.FlairSection.AddFlairBox");
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    val: name,
    isValid: isNameValid,
    errText: nameErrText,
    setVal: setName,
  } = useTextForm("", {
    validators: [noEmptyValidator(), maxLenValidator(24)],
  });

  const {
    val: description,
    isValid: isDescriptionValid,
    errText: descriptionErrText,
    setVal: setDescription,
  } = useTextForm("", { validators: [maxLenValidator(200)] });

  function handleAddButtonClick(): void {
    setAddDialogOpen(true);
  }

  function handleAddDialogClose(): void {
    setDescription("");
    setName("");
    setAddDialogOpen(false);
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setName(val);
  }

  function handleDescriptionChange(e: ChangeEvent<HTMLInputElement>): void {
    setDescription(e.target.value);
  }

  async function handleSubmitClick(): Promise<void> {
    try {
      const form: FlairBoxFormT = {
        board_id: board.id,
        name: name,
        description: description,
      };
      await FlairBoxApi.create(form);
      enqueueSnackbar(t("flairGroupCreateSuccess"), { variant: "success" });
      setAddDialogOpen(false);
      onCreated();
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("flairGroupCreateFailed"), { variant: "error" });
    }
  }

  const submitDisable = !isNameValid || !isDescriptionValid;

  return (
    <Fragment>
      <Button
        startIcon={<AddIcon />}
        onClick={handleAddButtonClick}
        variant='contained'
      >
        {t("addFlairGroup")}
      </Button>
      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
      >
        <Box
          px={2}
          py={2}
          minWidth={{ xs: "80vw", sm: 400 }}
        >
          <Col width='100%'>
            <Txt variant='h6'>{t("flairGroup")}</Txt>

            <Gap y={1} />

            <TextField
              variant='standard'
              value={name}
              label={t("groupName")}
              placeholder={t("groupNameHelper")}
              onChange={handleNameChange}
              error={Boolean(nameErrText)}
              helperText={nameErrText}
              autoComplete='off'
            />

            <Gap y={1} />

            <TextField
              variant='standard'
              value={description}
              label={t("flairGuide")}
              placeholder={t("flairGuideHelper")}
              multiline
              minRows={1}
              maxRows={5}
              autoComplete='off'
              error={Boolean(descriptionErrText)}
              helperText={descriptionErrText}
              onChange={handleDescriptionChange}
            />

            <Gap y={1} />

            <Row justifyContent='flex-end'>
              <Button onClick={handleAddDialogClose}>
                {t("cancel")}
              </Button>
              <Button
                variant='contained'
                disabled={submitDisable}
                onClick={handleSubmitClick}
              >
                {t("apply")}
              </Button>
            </Row>
          </Col>
        </Box>
      </Dialog>
    </Fragment>
  );
}
