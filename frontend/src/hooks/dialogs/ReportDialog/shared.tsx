"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import {
  Button, Dialog, Stepper, Step, StepLabel,
  Collapse, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel,
  Radio, Divider,
} from "@mui/material";
import { Row, Expand, Box, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardThemeProvider } from "@/ui/tools/BoardThemeProvider";
// logic
import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { useRecoilValue } from "recoil";
import * as PostReportApi from "@/apis/post_reports";
import * as CommentReportApi from "@/apis/comment_reports";
import { useSnackbar } from "@/hooks/Snackbar";
import { useBoardMain$ } from "@/stores/BoardMainStore";
import { useMe } from "@/stores/UserStore";
import { reportDialogState } from "./state";
import { ReportCategoryT, useReportCategories } from "./data";
import { useReportDialog } from "./hook";
import type { CommentReportFormT, PostReportFormT } from "@/types";

export enum ReportDialogStage {
  category = 0,
  custom,
}

export function ReportDialogShared(): JSX.Element {
  const t = useTranslations("hooks.dialogs.ReportDialog");

  const reportCategories = useReportCategories();
  const reportDialog = useRecoilValue(reportDialogState);
  const { type, targetId, isOpen } = reportDialog;
  const { enqueueSnackbar } = useSnackbar();
  const { closeReportDialog } = useReportDialog(type);
  const boardMain$ = useBoardMain$();
  const me = useMe();

  const [stage, setStage] = useState<ReportDialogStage>(ReportDialogStage.category);
  const [reason, setReason] = useState<string>("");
  const [category, setCategory] = useState<string | undefined>();

  const nextDisable = category === undefined;
  const submitDisable = category === undefined ;

  // reset on open
  useEffect(() => {
    if (isOpen) {
      setStage(ReportDialogStage.category);
      setReason("");
      setCategory(undefined);
    }
  }, [isOpen]);

  const categoryItem: null | ReportCategoryT = useMemo(() => {
    if (!category) {
      return null;
    }
    const idx = reportCategories.findIndex((val) => val.key === category);
    if (idx < 0) {
      return null;
    }
    return reportCategories[idx];
  }, [category]);

  function handleReasonChange(e: ChangeEvent<HTMLInputElement>): void {
    let val = e.target.value;
    if (val.length > 30) {
      val = val.slice(0, 30);
    }
    setReason(val);
  }

  function handleNextClick(): void {
    setStage(ReportDialogStage.custom);
  }

  function handlePrevClick(): void {
    setStage(ReportDialogStage.category);
  }

  async function handleSubmitClick(): Promise<void> {
    if (!category) {
      return;
    }
    // post
    if (type === "post") {
      const form: PostReportFormT = {
        user_id: me!.id,
        post_id: targetId,
        reason: reason,
        category: category,
      };
      try {
        await PostReportApi.create(form);
        enqueueSnackbar(t("reportSuccess"), { variant: "success" });
        closeReportDialog();
      } catch (e) {
        console.warn(e);
        enqueueSnackbar(t("reportFailed"), { variant: "error" });
      }
    }
    // comment
    if (type === "comment") {
      const form: CommentReportFormT = {
        user_id: me!.id,
        comment_id: targetId,
        reason: reason,
        category: category,
      };
      try {
        await CommentReportApi.create(form);
        enqueueSnackbar(t("reportSuccess"), { variant: "success" });
        closeReportDialog();
      } catch (e) {
        console.warn(e);
        enqueueSnackbar(t("reportFailed"), { variant: "error" });
      }
    }
  }

  function handleCategoryChange(e: ChangeEvent<HTMLElement>, value: string): void {
    e.preventDefault();
    e.stopPropagation();
    setCategory(value);
  }

  function handleClose(): void {
    closeReportDialog();
  }

  // view

  function renderStageCategory(): JSX.Element {
    return (
      <Fragment>
        <FormControl>
          <FormLabel sx={{ fontSize: "16px", fontWeight: 700 }}>{t("reportReason")}</FormLabel>
          <RadioGroup
            value={category ?? ""}
            onChange={handleCategoryChange}
          >
            {reportCategories.map((rc) => {
              return (
                <FormControlLabel
                  key={rc.key}
                  value={rc.key}
                  control={<Radio />}
                  label={rc.label}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
        <Gap y={2} />
        <Collapse in={Boolean(categoryItem)}>
          <Divider />
          <Txt
            variant='subtitle2'
            color='vague.main'
          >
            {categoryItem?.description}
          </Txt>
        </Collapse>
      </Fragment>
    );
  }

  function renderStageCustom(): JSX.Element {
    return (
      <Fragment>
        <Txt
          variant='subtitle2'
          color='vague.main'
        >
          {t("typeMoreReason")}
        </Txt>
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          variant='standard'
          label={t("moreReason")}
          onChange={handleReasonChange}
          value={reason}
        />
      </Fragment>
    );
  }

  return (
    <BoardThemeProvider board={boardMain$.data?.board ?? null}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth
        maxWidth='xs'
      >
        <Box p={2}>
          <Stepper activeStep={stage}>
            <Step completed={Boolean(category)}>
              <StepLabel>{t("selectReportReason")}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{t("moreReason")}</StepLabel>
            </Step>
          </Stepper>

          <Gap y={2} />

          <Box>{stage === ReportDialogStage.category ? renderStageCategory() : renderStageCustom()}</Box>

          <Gap y={2} />

          {/* actions */}
          <Row>
            {stage === ReportDialogStage.custom && <Button onClick={handlePrevClick}>{t("prev")}</Button>}
            <Expand />
            <Button onClick={handleClose}>
              {t("cancel")}
            </Button>
            {stage === ReportDialogStage.category ? (
              <Button
                variant='contained'
                disabled={nextDisable}
                onClick={handleNextClick}
              >
                {t("next")}
              </Button>
            ) : (
              <Button
                variant='contained'
                disabled={submitDisable}
                onClick={handleSubmitClick}
              >
                {t("submit")}
              </Button>
            )}
          </Row>
        </Box>
      </Dialog>
    </BoardThemeProvider>
  );
}
