"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { IconButton, Button, TextField } from "@mui/material";
import { EditIcon } from "@/ui/icons";
import { Row, Gap, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
// logic

import { useState, MouseEvent, ChangeEvent } from "react";
import { TextFieldProps, TypographyProps } from "@mui/material";
import { ValidatorT } from "@/utils/validator";
import { useTextForm } from "@/hooks/TextForm";

type EditableTextFieldProps = TextFieldProps & {
  value: string;
  txtProps?: TypographyProps;
  validators?: ValidatorT[];
  helpers?: ValidatorT[];
  actionLoc?: "right" | "bottom";
  onUpdate: (val: string) => any;
  renderText?: (val: string, handleEditClick: (e: MouseEvent<HTMLButtonElement>) => any) => JSX.Element;
};

export function EditableTextField({
  value: initText,
  txtProps,
  validators,
  helpers,
  onUpdate,
  actionLoc = "right",
  renderText,
  ...tfProps
}: EditableTextFieldProps): JSX.Element {
  const t = useTranslations("ui.tools.EditableTextField");
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const {
    val: text,
    setVal: setText,
    isValid: isTextValid,
    errText,
    helpText,
  } = useTextForm(initText, {
    validators: validators,
    helpers: helpers,
  });

  const submitDisable = !isTextValid;

  function handleEditClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setEditorOpen(true);
  }

  function handleCancelClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setEditorOpen(false);
  }

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    setText(e.target.value);
  }

  async function handleSubmitClick(e: MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    await onUpdate(text);
    setEditorOpen(false);
  }

  if (editorOpen) {
    return (
      <Box
        width={tfProps.fullWidth ? "100%" : undefined}
        display='flex'
        flexDirection={actionLoc == "right" ? "row" : "column"}
      >
        <TextField
          {...tfProps}
          value={text}
          error={Boolean(errText)}
          helperText={errText ?? helpText}
          onChange={handleTextChange}
        />

        {actionLoc == "bottom" && (
          <Gap y={1}/>
        )}

        <Row justifyContent='flex-end'>
          <Button
            onClick={handleCancelClick}
          >
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
      </Box>
    );
  } else if (renderText) {
    return renderText(text, handleEditClick);
  } else {
    return (
      <Txt {...txtProps}>
        {initText}
        <IconButton
          aria-label='edit-button'
          onClick={handleEditClick}
        >
          <EditIcon />
        </IconButton>
      </Txt>
    );
  }
}
