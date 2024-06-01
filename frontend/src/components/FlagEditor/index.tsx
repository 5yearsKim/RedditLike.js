"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Box, Grid, Button, TextField, Switch, InputAdornment, Collapse } from "@mui/material";
import { ArrowRightIcon } from "@/ui/icons";
import { Row, Gap, GridItem } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Flag } from "@/components/Flag";
import { ColorPicker } from "@/ui/tools/ColorPicker";
import { ColorToggler } from "@/ui/tools/ColorToggler";
import { EmojiSelector } from "@/ui/tools/EmojiSelector";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";
// logic
import { useState, ChangeEvent } from "react";
import { noEmptyValidator, maxLenValidator, charRemainingHelper } from "@/utils/validator";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useTextForm } from "@/hooks/TextForm";
import { MAX_FLAG_LABEL_CNT } from "@/config";
import type { FlagT, FlagFormT } from "@/types";


export type FlagEditorProps = {
  boardId: idT;
  preFlag?: FlagT;
  onSave: (flag: FlagFormT) => void;
  onCancel: (flag: FlagFormT) => void;
};

export function FlagEditor({
  boardId,
  preFlag,
  onSave,
  onCancel,
}: FlagEditorProps): JSX.Element {
  const t = useTranslations("components.FlagEditor");

  const {
    val: label,
    isValid: isLabelValid,
    errText: labelErrText,
    helpText: labelHelpText,
    setVal: setLabel,
  } = useTextForm(preFlag?.label ?? "", {
    validators: [noEmptyValidator(), maxLenValidator(MAX_FLAG_LABEL_CNT)],
    helpers: [charRemainingHelper(MAX_FLAG_LABEL_CNT)],
  });
  const [managerOnly, setManagerOnly] = useState<boolean>(preFlag?.manager_only ?? false);
  const [textColor, setTextColor] = useState<string | undefined>(preFlag?.text_color ?? undefined);
  const [bgColor, setBgColor] = useState<string | undefined>(preFlag?.bg_color ?? undefined);
  const [descActive, setDescActive] = useState<boolean>(Boolean(preFlag?.description));
  const [description, setDescription] = useState<string | null>(preFlag?.description ?? "");

  // const [flag, setFlag] = useState<FlagFormT>(preFlag ?? { label: '', board_id: bid });
  const { showAlertDialog } = useAlertDialog();

  const submitDisable = !isLabelValid;

  function handleLabelChange(e: ChangeEvent<HTMLInputElement>): void {
    const label = e.target.value;
    setLabel(label);
  }

  function handleEmojiSelect(emoji: string): void {
    setLabel(label + emoji);
  }

  function handleTextColorChange(color: string): void {
    setTextColor(color);
  }

  function handleBgColorChange(color: string): void {
    setBgColor(color);
  }

  function handleManagerOnlyChange(e: ChangeEvent<HTMLInputElement>): void {
    setManagerOnly(e.target.checked);
  }

  function handleDescActiveChange(e: ChangeEvent<HTMLInputElement>): void {
    setDescActive(e.target.checked);
  }

  function handleDescriptionChange(e: ChangeEvent<HTMLInputElement>): void {
    setDescription(e.target.value);
  }

  const flagForm: FlagFormT = {
    board_id: boardId,
    label: label,
    manager_only: managerOnly,
    text_color: textColor,
    bg_color: bgColor,
    description: descActive ? description : null,
  };

  async function handleSaveClick(): Promise<void> {
    if (!bgColor) {
      await showAlertDialog({
        body: t("pleaseSelectBg"),
        useOk: true,
      });
      return;
    }
    onSave(flagForm);
  }

  function handleCancelClick(): void {
    onCancel(flagForm);
  }


  return (
    <Fragment>
      <Row justifyContent='center'>
        {preFlag && (
          <Fragment>
            <Flag flag={preFlag} />
            <ArrowRightIcon />
          </Fragment>
        )}
        {flagForm.label && <Flag flag={flagForm} />}
      </Row>

      <Gap y={1} />

      <Row justifyContent='center'>
        <TextField
          label={t("label")}
          variant='standard'
          value={flagForm.label}
          onChange={handleLabelChange}
          error={Boolean(labelErrText)}
          helperText={labelErrText ?? labelHelpText}
          sx={{
            margin: "auto",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <EmojiSelector onEmojiSelect={handleEmojiSelect} />
              </InputAdornment>
            ),
          }}
        />
      </Row>

      <Gap y={1} />

      <Grid
        container
        rowGap={1 / 2}
      >
        <GridItem xs={8}>
          <Txt variant='subtitle2'>{t("bgColor")}</Txt>
        </GridItem>
        <GridItem xs={4}>
          <ColorPicker
            color={flagForm.bg_color ?? undefined}
            onColorChange={handleBgColorChange}
          />
        </GridItem>

        <GridItem xs={8}>
          <Txt variant='subtitle2'>{t("textColor")}</Txt>
        </GridItem>
        <GridItem xs={4}>
          <ColorToggler
            color={flagForm.text_color ?? undefined}
            onColorChange={handleTextColorChange}
          />
        </GridItem>
        <GridItem xs={8}>
          <Txt variant='subtitle2'>{t("managerOnly")}</Txt>
        </GridItem>
        <GridItem xs={4}>
          <Switch
            checked={flagForm.manager_only ?? false}
            onChange={handleManagerOnlyChange}
          />
        </GridItem>
        <GridItem xs={8}>
          <Row>
            <Txt variant='subtitle2'>{t("useGuideline")}</Txt>
            <Box mr={0.5} />
            <HelperTooltip tip={t("useGuidelineHelper")} />
          </Row>
        </GridItem>
        <GridItem xs={4}>
          <Switch
            checked={flagForm.description !== null}
            onChange={handleDescActiveChange}
          />
        </GridItem>
      </Grid>

      <Collapse in={flagForm.description !== null}>
        <Row justifyContent='center'>
          <TextField
            fullWidth
            multiline
            value={flagForm.description ?? ""}
            onChange={handleDescriptionChange}
            variant='standard'
            label={t("flagGuideline")}
            placeholder={t("flagGuidelineHelper")}
            sx={{ maxWidth: "350px" }}
          />
        </Row>
      </Collapse>

      <Gap y={1} />

      <Row justifyContent='flex-end'>
        <Button onClick={handleCancelClick}>
          {t("cancel")}
        </Button>
        <Button
          variant='contained'
          disabled={submitDisable}
          onClick={handleSaveClick}
        >
          {t("apply")}
        </Button>
      </Row>
    </Fragment>
  );
}
