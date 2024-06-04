"use client";

import React, { ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Dialog } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardThemeProvider } from "@/ui/tools/BoardThemeProvider";
import { BoardAuthor } from "@/components/BoardAuthor";
import { isBefore } from "date-fns";
import { vizDate } from "@/utils/time";
// logic
import { useEffect, useState, ChangeEvent, MouseEvent } from "react";
import { useRecoilValue } from "recoil";
import { addDays, addMonths, addYears } from "date-fns";
import { SelectChangeEvent } from "@mui/material";
import { useSnackbar } from "@/hooks/Snackbar";
import { useBoardMain$ } from "@/stores/BoardMainStore";
import * as BoardMuterApi from "@/apis/board_muters";
import * as MuterApi from "@/apis/muters";
import { blockAuthorDialogState, useBlockAuthorDialog } from "./hook";
import type { BoardMuterFormT, MuterFormT } from "@/types";

export type DurationCandT = "7d" | "1m" | "3m" | "1y";

export function BlockAuthorDialogShared(): ReactNode {
  const locale = useLocale();
  const t = useTranslations("hooks.dialogs.BlockAuthorDialog");

  const { enqueueSnackbar } = useSnackbar();
  const { closeBlockAutorDialog } = useBlockAuthorDialog();

  const { isOpen, author, type, until: initUntil, reason: initReason } = useRecoilValue(blockAuthorDialogState);


  const boardMain$ = useBoardMain$();
  const [duration, setDuration] = useState<DurationCandT | undefined>();
  const [until, setUntil] = useState<Date | undefined>();
  const [reason, setReason] = useState<string>("");

  const untilType: "cands" | "calendar" = initUntil ? "calendar" : "cands";

  const submitDisable = reason.length == 0 || !until;

  useEffect(() => {
    let until = new Date();
    switch (duration) {
    case "7d":
      until = addDays(until, 7);
      break;
    case "1m":
      until = addMonths(until, 1);
      break;
    case "3m":
      until = addMonths(until, 3);
      break;
    case "1y":
      until = addYears(until, 1);
      break;
    default:
      break;
    }
    setUntil(until);
  }, [duration]);

  useEffect(() => {
    setReason(initReason ?? "");
    setDuration(undefined);
    setUntil(initUntil ?? undefined);
  }, [isOpen]);

  function handleClose(): void {
    closeBlockAutorDialog();
  }

  function handleDurationChange(e: SelectChangeEvent): void {
    const val = e.target.value;
    setDuration(val as DurationCandT);
  }

  function handleReasonChange(e: ChangeEvent<HTMLInputElement>): void {
    setReason(e.target.value);
  }

  function handleUntilChange(newUntil: Date): void {
    setUntil(newUntil);
  }

  async function handleSubmitClick(e: MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    try {
      if (type == "board") {
        const form: BoardMuterFormT = {
          board_id: author.board_id,
          user_id: author.id,
          reason: reason,
          until: until,
        };
        await BoardMuterApi.create(form);
        if (initUntil) {
          enqueueSnackbar(t("editSuccess"), { variant: "success" });
        } else {
          enqueueSnackbar(t("createSuccess"), { variant: "success" });
        }
      } else if (type == "group") {
        const form: MuterFormT = {
          user_id: author.id,
          reason: reason,
          until: until ?? null,
        };
        await MuterApi.create(form);
        enqueueSnackbar(t("createSuccess"), { variant: "success" });
      } else {
        throw new Error("invalid type" + type);
      }
      closeBlockAutorDialog();
    } catch (e) {
      console.warn(e);
    }
  }

  function renderUntil(): JSX.Element {
    if (untilType == "cands") {
      return (
        <>
          <FormControl>
            <InputLabel>{t("duration")}</InputLabel>
            <Select
              label={t("duration")}
              variant='outlined'
              value={duration ?? ""}
              onChange={handleDurationChange}
            >
              <MenuItem value='7d'>{t("1week")}</MenuItem>
              <MenuItem value='1m'>{t("1month")}</MenuItem>
              <MenuItem value='3m'>{t("3month")}</MenuItem>
              <MenuItem value='1y'>{t("1year")}</MenuItem>
            </Select>
          </FormControl>
          {Boolean(until) && (
            <Txt
              textAlign='end'
              color='vague.main'
            >
              {t("untilDate", { until: vizDate(until, { type: "short", locale }) })}
            </Txt>
          )}
        </>
      );
    } else if (untilType == "calendar") {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={t("duration")}
            value={until}
            shouldDisableDate={(day): boolean => isBefore(day, new Date())}
            onChange={(newUntil): void => {
              if (newUntil) {
                handleUntilChange(newUntil);
              }
            }}
            // render
            // renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      );
    }
    return <></>;
  }

  return (
    <BoardThemeProvider board={boardMain$.data?.board ?? null}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
      >
        <Col
          px={4}
          py={3}
          maxWidth={360}
        >
          <Txt variant='h5'>
            { type == "board" && t("boardRestriction") }
            { type == "group" && t("groupRestriction") }
          </Txt>

          <Gap y={1} />

          <Txt color='vague.main'>
            {type == "board" && t("boardRestrictionMsg")}
            {type == "group" && t("groupRestrictionMsg")}
          </Txt>

          <Gap y={1} />

          <BoardAuthor author={author} />

          <Gap y={2} />

          {renderUntil()}

          <Gap y={1} />

          <TextField
            id='user-lock-reason'
            variant='standard'
            label={t("reason")}
            value={reason}
            onChange={handleReasonChange}
            fullWidth
            minRows={2}
            maxRows={5}
          />

          <Gap y={2} />

          <Row justifyContent='flex-end'>
            <Button onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button
              variant='contained'
              disabled={submitDisable}
              onClick={handleSubmitClick}
            >
              {t("submit")}
            </Button>
          </Row>
        </Col>
      </Dialog>
    </BoardThemeProvider>
  );
}
