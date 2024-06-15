"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button, Grid, Checkbox, TextField, Switch, InputAdornment } from "@mui/material";
import { ArrowRightIcon } from "@/ui/icons";
import { Flair } from "@/components/Flair";
import { GridItem, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ColorPicker } from "@/ui/tools/ColorPicker";
import { ColorToggler } from "@/ui/tools/ColorToggler";
import { EmojiSelector } from "@/ui/tools/EmojiSelector";
import { Deactivate } from "@/ui/tools/Deactivate";
// logic
import { useState, ChangeEvent } from "react";
import { noEmptyValidator, maxLenValidator, charRemainingHelper } from "@/utils/validator";
import { useTextForm } from "@/hooks/TextForm";
import { MAX_FLAIR_LABEL_CNT } from "@/env";
import type { FlairT, FlairFormT } from "@/types";


type FlairEditorProps = {
  fbid: idT;
  preFlair?: FlairT;
  isManager?: boolean;
  onSave: (flair: FlairFormT) => void;
  onCancel: (flair: FlairFormT) => void;
};

export function FlairEditor({
  fbid,
  preFlair,
  isManager,
  onSave,
  onCancel,
}: FlairEditorProps): JSX.Element {
  const t = useTranslations("components.FlairEditor");
  const {
    val: label,
    isValid: isLabelValid,
    errText: labelErrText,
    helpText: labelHelpText,
    setVal: setLabel,
  } = useTextForm(preFlair?.label ?? "", {
    validators: [noEmptyValidator(), maxLenValidator(MAX_FLAIR_LABEL_CNT)],
    helpers: [charRemainingHelper(MAX_FLAIR_LABEL_CNT)],
  });
  const [managerOnly, setManagerOnly] = useState<boolean>(preFlair?.manager_only ?? false);
  const [textColorActive, setTextColorActive] = useState<boolean>(Boolean(preFlair?.text_color));
  const [textColor, setTextColor] = useState<string | null>(preFlair?.text_color ?? null);
  const [bgColorActive, setBgColorActive] = useState<boolean>(Boolean(preFlair?.bg_color));
  const [bgColor, setBgColor] = useState<string | null>(preFlair?.bg_color ?? null);

  const submitDisable = !isLabelValid;

  function handleLabelChange(e: ChangeEvent<HTMLInputElement>): void {
    const label = e.target.value;
    setLabel(label);
  }

  function handleEmojiSelect(emoji: string): void {
    setLabel(label + emoji);
  }

  function handleManagerOnlyChange(e: ChangeEvent<HTMLInputElement>): void {
    setManagerOnly(e.target.checked);
  }

  function handleTextColorActiveChange(e: ChangeEvent<HTMLInputElement>): void {
    setTextColorActive(e.target.checked);
  }

  function handleTextColorChange(color: string): void {
    setTextColor(color);
  }

  function handleBgColorActiveChange(e: ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    setBgColorActive(checked);
    if (checked && textColor) {
      setTextColor("#ffffff");
    }
  }
  function handleBgColorChange(color: string): void {
    setBgColor(color);
  }

  const flairForm: FlairFormT = {
    box_id: fbid,
    label: label,
    manager_only: managerOnly,
    text_color: textColorActive ? textColor : null,
    bg_color: bgColorActive ? bgColor : null,
  };

  function handleSaveClick(): void {
    onSave(flairForm);
  }

  function handleCancelClick(): void {
    onCancel(flairForm);
  }


  return (
    <Fragment>
      <Row justifyContent='center'>
        {preFlair && (
          <Fragment>
            <Flair
              size='md'
              flair={preFlair}
            />
            <ArrowRightIcon />
          </Fragment>
        )}
        {flairForm.label && (
          <Flair
            size='md'
            flair={flairForm}
          />
        )}
      </Row>

      <Gap y={1} />

      <Row justifyContent='center'>
        <TextField
          label={t("label")}
          variant='standard'
          value={flairForm.label}
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
        rowGap={0.5}
      >
        {isManager && (
          <Fragment>
            <GridItem xs={8}>
              <Txt variant='subtitle2'>{t("managerOnly")}</Txt>
            </GridItem>
            <GridItem xs={4}>
              <Switch
                checked={flairForm.manager_only ?? false}
                onChange={handleManagerOnlyChange}
              />
            </GridItem>
          </Fragment>
        )}

        <GridItem xs={8}>
          <Row>
            <Checkbox
              checked={bgColorActive}
              onChange={handleBgColorActiveChange}
            />
            <Deactivate on={!bgColorActive}>
              <Txt variant='subtitle2'>{t("bgColor")}</Txt>
            </Deactivate>
          </Row>
        </GridItem>
        <GridItem xs={4}>
          <Deactivate on={!bgColorActive}>
            <ColorPicker
              color={flairForm.bg_color ?? undefined}
              onColorChange={handleBgColorChange}
            />
          </Deactivate>
        </GridItem>

        <GridItem xs={8}>
          <Row>
            <Checkbox
              checked={textColorActive}
              onChange={handleTextColorActiveChange}
            />
            <Deactivate on={!textColorActive}>
              <Txt variant='subtitle2'>{t("textColor")}</Txt>
            </Deactivate>
          </Row>
        </GridItem>
        <GridItem xs={4}>
          <Deactivate on={!textColorActive}>
            {bgColorActive ? (
              <ColorToggler
                color={flairForm.text_color ?? undefined}
                onColorChange={handleTextColorChange}
              />
            ) : (
              <ColorPicker
                color={flairForm.text_color ?? undefined}
                onColorChange={handleTextColorChange}
              />
            )}
          </Deactivate>
        </GridItem>
      </Grid>

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
