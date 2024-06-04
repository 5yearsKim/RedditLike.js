"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { IconButton, Dialog, Button, TextField, InputAdornment } from "@mui/material";
import { EditIcon } from "@/ui/icons";
import { EmojiSelector } from "@/ui/tools/EmojiSelector";
import { Row, Container, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
// logic
import { useEffect, useState, useCallback, MouseEvent, ChangeEvent } from "react";
import { debounce } from "@mui/material/utils";
import { useTextForm } from "@/hooks/TextForm";
import { noEmptyValidator, maxLenValidator } from "@/utils/validator";
import * as BoardApi from "@/apis/boards";

type EditableBoardNameProps = {
  name: string;
  onUpdated: (name: string) => any;
};

export function EditableBoardName({
  name: initName,
  onUpdated,
}: EditableBoardNameProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.IntroTab.EditableBoardName");

  const [uniqueChecked, setUniqueChecked] = useState<undefined | boolean>();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  let {
    // eslint-disable-next-line
    val: name,
    // eslint-disable-next-line
    setVal: setName,
    // eslint-disable-next-line
    isValid: isNameValid,
    errText: nameErrText,
    helpText: nameHelpText,
  } = useTextForm(initName, {
    validators: [noEmptyValidator(), maxLenValidator(24)],
  });

  const submitDisable = name == initName || !isNameValid || !uniqueChecked;

  if (initName != name) {
    if (uniqueChecked === undefined) {
      nameHelpText = t("checkingDuplicate");
    } else if (uniqueChecked === false) {
      nameErrText = t("alreadyExist");
    } else if (uniqueChecked === true) {
      nameHelpText = t("nameIsValid");
    }
  }

  useEffect(() => {
    if (editorOpen) {
      setName(initName);
    }
  }, [editorOpen]);

  useEffect(() => {
    _checkUnique(name);
  }, [name]);

  const _checkUnique = useCallback(
    debounce(async (name: string): Promise<void> => {
      name = name.trim();
      try {
        const { data: found } = await BoardApi.getByName(name);
        const isUnique = !found;
        setUniqueChecked(isUnique);
      } catch (e) {
        console.warn(e);
        setUniqueChecked(undefined);
      }
    }, 500),
    [],
  );

  function handleEditClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setEditorOpen(true);
  }

  function handleEditorClose(): void {
    setEditorOpen(false);
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setName(val);
    setUniqueChecked(undefined);
  }

  function handleEmojiSelect(emoji: string): void {
    setName(name + emoji);
  }

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>): Promise<void> {
    e.stopPropagation();
    await onUpdated(name);
    setEditorOpen(false);
  }

  return (
    <Fragment>
      <Row>
        <Txt variant='h5'>{initName}</Txt>
        <IconButton onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
      </Row>
      <Dialog
        open={editorOpen}
        onClose={handleEditorClose}
      >
        <Container>
          <Gap y={2} />

          <TextField
            label={t("boardName")}
            value={name}
            onChange={handleNameChange}
            error={Boolean(nameErrText)}
            helperText={nameErrText ?? nameHelpText}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <EmojiSelector
                    onEmojiSelect={handleEmojiSelect}
                    origin={{ vertical: "top", horizontal: "left" }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Gap y={1} />

          <Row justifyContent='flex-end'>
            <Button onClick={handleEditorClose}>
              {t("cancel")}
            </Button>
            <Button
              variant='contained'
              disabled={submitDisable}
              onClick={handleSubmit}
            >
              {t("apply")}
            </Button>
          </Row>

          <Gap y={1} />
        </Container>
      </Dialog>
    </Fragment>
  );
}
