"use client";
import React, { useState, Fragment, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Row, Col, Gap, Box } from "@/ui/layouts";
import { AddIcon } from "@/ui/icons";
import { Txt } from "@/ui/texts";
import { Clickable } from "@/ui/tools/Clickable";
import { TextField, Button, InputBase, FormControlLabel, Checkbox } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { isBefore } from "date-fns";
import { useTextForm } from "@/hooks/TextForm";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useMe } from "@/stores/UserStore";
import { maxLenValidator } from "@/utils/validator";
import { EditablePollCand } from "./EditablePollCand";
import type { PollT, PollFormT, PollCandT, PollCandFormT } from "@/types";


type PollEditorProps = {
  pollInfo?: {poll: PollT, cands: PollCandT[]}
  isUploading?: boolean
  onCancel: () => void
  onSubmit: (form: PollFormT, relations: {cands: PollCandFormT[]}) => void
}

export function PollEditor({
  pollInfo,
  isUploading,
  onCancel,
  onSubmit,
}: PollEditorProps): JSX.Element {
  const t = useTranslations("components.PollEditor");

  const me = useMe();
  const { showAlertDialog } = useAlertDialog();

  const [cands, setCands] = useState<PollCandFormT[]>([]);
  const [expiresOnceClicked, setExpiresOnceClicked] = useState<boolean>(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [allowMultiple, setAllowMultiple] = useState<boolean>(false);
  const {
    val: title,
    setVal: setTitle,
    isValid: isTitleValid,
    errText: titleErrText,
    helpText: titleHelpText,
  } = useTextForm("", {
    validators: [maxLenValidator(50)],
  });
  const [description, setDescription] = useState<string>("");

  const submitDisabled = cands.length < 2 || !isTitleValid || isUploading;

  useEffect(() => {
    if (!pollInfo) {
      return;
    }
    const { poll, cands } = pollInfo;
    // console.log(poll)
    setTitle(poll.title ?? "");
    setDescription(poll.description ?? "");
    if (poll.expires_at) {
      setExpiresOnceClicked(true);
      setExpiresAt(new Date(poll.expires_at));
    }
    setAllowMultiple(poll.allow_multiple);
    setCands(cands);
  }, []);


  function handleCancelClick(): void {
    onCancel();
  }

  function handleSubmitClick(): void {
    if (!me) {
      return;
    }
    if (cands.some((cand) => cand.label == "")) {
      showAlertDialog({
        title: t("missingText"),
        body: t("missingTextMsg"),
        useOk: true,
      });
      return;
    }
    const form: PollFormT = {
      author_id: me.id,
      title: title,
      description: description,
      expires_at: expiresAt,
      allow_multiple: allowMultiple,
    };
    onSubmit(form, { cands: cands });
  }

  function handleAddCandClick(): void {
    const newCand: PollCandFormT = {
      poll_id: -1, // dummy
      label: "",
    };
    setCands([...cands, newCand]);
  }

  function handleCandChange(newForm: PollCandFormT, idx: number): void {
    const newCands = [...cands];
    newCands[idx] = newForm;
    setCands(newCands);
  }

  async function handleCandDelete(idx: number): Promise<void> {
    const newCands = [...cands];
    newCands.splice(idx, 1);
    setCands(newCands);
  }

  function handleExpiresClick(): void {
    setExpiresOnceClicked(true);
  }

  function handleExpiresAtChange(newVal: Date | null): void {
    setExpiresAt(newVal);
  }


  return (
    <Col>
      <TextField
        label={t("pollTitle")}
        variant="standard"
        placeholder={t("pollTitleHelper")}
        error={Boolean(titleErrText)}
        helperText={titleErrText ?? titleHelpText}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Gap y={1}/>
      <InputBase
        value={description}
        minRows={2}
        placeholder={t("descriptionHelper")}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Gap y={2}/>

      <Col rowGap={1}>
        {cands.map((cand, i) => (
          <Fragment key={i}>
            <EditablePollCand
              cand={cand}
              onChange={(newForm) => handleCandChange(newForm, i)}
              onDelete={() => handleCandDelete(i)}
            />
          </Fragment>
        ))}
      </Col>

      {cands.length < 2 && (
        <Row justifyContent='center' my={2}>
          <Txt variant="body3">{t("minCandMsg")}</Txt>
        </Row>
      )}

      <Gap y={2}/>


      <Button
        variant='outlined'
        startIcon={<AddIcon/>}
        onClick={handleAddCandClick}
      >
        {t("addCand")}
      </Button>

      <Gap y={1}/>


      <Row justifyContent='flex-end'>
        {expiresOnceClicked ? (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label={t("pollExpiresAt")}
              slotProps={{
                textField: { variant: "standard" },
              }}
              value={ expiresAt }
              shouldDisableDate={(day): boolean => isBefore(day, new Date())}
              onChange={handleExpiresAtChange}

            // renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        ) : (
          <Clickable
            borderRadius={1}
            px={2}
            py={0.5}
            onClick={handleExpiresClick}
          >
            <Row>
              <AddIcon fontSize='small'/>
              <Gap x={1}/>
              <Txt variant="body3">{t("periodSetting")}</Txt>
            </Row>
          </Clickable>
        )}
      </Row>

      <Row justifyContent='flex-end'>
        <FormControlLabel
          control={
            <Checkbox
              size='small'
              checked={allowMultiple || false}
              onChange={(e) => setAllowMultiple(e.target.checked)}
            />
          }
          label={
            <Box mb={0.5}>
              <Txt variant='body3'>{t("allowMultiple")}</Txt>
            </Box>
          }
        />
      </Row>

      <Gap y={2}/>

      <Row justifyContent='flex-end'>
        <Button
          onClick={handleCancelClick}
        >
          {t("cancel")}
        </Button>
        <Button
          variant='contained'
          onClick={handleSubmitClick}
          disabled={submitDisabled}
        >
          {pollInfo ? t("modify") : t("create")}
        </Button>

      </Row>
    </Col>
  );
}