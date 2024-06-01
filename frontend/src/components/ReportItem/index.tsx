"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Row, Expand, Box, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ArrowRightIcon, CheckIcon, CloseIcon, ReportIcon } from "@/ui/icons";
import { vizTime } from "@/utils/time";
// logic
import { useMemo, useState } from "react";
// import { SelectChangeEvent } from '@mui/material';
import { useReportCategories } from "@/hooks/dialogs/ReportDialog/data";
import { useSnackbar } from "@/hooks/Snackbar";
import { toDateTime } from "@/utils/time";
import * as PostReportApi from "@/apis/post_reports";
import * as CommentReportApi from "@/apis/comment_reports";
import type { CommentReportT, PostReportT } from "@/types";

type ReportItemProps = {
  type: "comment" | "post";
  report: CommentReportT | PostReportT;
};

export function ReportItem({
  type,
  report,
}: ReportItemProps): JSX.Element {
  const t = useTranslations("components.ReportItem");
  const locale = useLocale();
  const reportCategories = useReportCategories();

  const { enqueueSnackbar } = useSnackbar();
  const [ignoredAt, setIgnoredAt] = useState<Date | null>(toDateTime(report.ignored_at));
  const [resolvedAt, setResolvedAt] = useState<Date | null>(toDateTime(report.resolved_at));

  const category = useMemo(() => {
    const found = reportCategories.find((item) => item.key === report.category);
    return found;
  }, [report]);

  // const reportStatus = useMemo(() => {
  //   if (resolvedAt) {
  //     return 'resolved';
  //   }
  //   if (ignoredAt) {
  //     return 'ignored';
  //   }
  //   return 'unresolved';
  // }, [ignoredAt, resolvedAt]);

  // function handleStatusChange(e: SelectChangeEvent): void {
  //   const status = e.target.value;
  //   console.log(status);
  //   if (status == 'ignored') {
  //     _handleIgnore();
  //   }
  //   if (status == 'resolved') {
  //     _handleResolve();
  //   }
  //   if (status == 'unresolved') {
  //     _handle
  //   }
  // }

  async function handleIgnoreClick(): Promise<void> {
    try {
      if (type == "post") {
        await PostReportApi.ignore(report.id);
      } else if (type == "comment") {
        await CommentReportApi.ignore(report.id);
      } else {
        throw new Error(`type ${type} is not supported`);
      }
      setIgnoredAt(new Date());
      setResolvedAt(null);
      enqueueSnackbar(t("ignoreSuccess"), { variant: "info" });
    } catch (e) {
      console.warn(e);
    }
  }

  async function handleResolveClick(): Promise<void> {
    try {
      if (type == "post") {
        await PostReportApi.resolve(report.id);
      } else if (type == "comment") {
        await CommentReportApi.resolve(report.id);
      } else {
        throw new Error(`type ${type} is not supported`);
      }
      setIgnoredAt(null);
      setResolvedAt(new Date());
      enqueueSnackbar( t("resolveSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
    }
  }


  const theme = useTheme();

  function renderAction(): JSX.Element {
    const ignoreBtn = (
      <Button
        onClick={handleIgnoreClick}
        size='small'
        startIcon={<CloseIcon />}
        color='warning'
      >
        {t("ignore")}
      </Button>
    );

    const resolveBtn = (
      <Button
        onClick={handleResolveClick}
        size='small'
        startIcon={<CheckIcon />}
        color='success'
      >
        {t("resolve")}
      </Button>
    );
    if (ignoredAt) {
      return (
        <Row>
          <Button
            variant='outlined'
            startIcon={<CloseIcon />}
            color='warning'
            size='small'
            sx={{ borderRadius: 4 }}
          >
            {t("ignored")}
          </Button>
          <Gap x={1} />
          <Txt
            variant='body3'
            color='vague.light'
          >
            {vizTime(ignoredAt, { type: "relative", locale })}
          </Txt>
          <Expand />
          {resolveBtn}
        </Row>
      );
    }
    if (resolvedAt) {
      return (
        <Row>
          <Button
            variant='outlined'
            startIcon={<CheckIcon />}
            color='success'
            size='small'
            sx={{ borderRadius: 4 }}
          >
            {t("resolved")}
          </Button>
          <Gap x={1} />
          <Txt
            variant='body3'
            color='vague.light'
          >
            {vizTime(resolvedAt, { type: "relative", locale })}
          </Txt>
          <Expand />
          {ignoreBtn}
        </Row>
      );
    }
    return (
      <Row>
        {ignoreBtn}
        {resolveBtn}
      </Row>
    );
  }

  return (
    <Box
      borderRadius={2}
      px={2}
      py={1}
      sx={{
        bgcolor: alpha(
          ignoredAt ? theme.palette.warning.main : resolvedAt ? theme.palette.success.main : "#ffff00",
          0.1,
        ),
      }}
    >
      <Row>
        <ReportIcon
          fontSize='small'
          sx={{ mr: 0.5 }}
        />
        <Txt variant='subtitle2'>
          {t("report")}/
          {category?.label}
          {/* TO FIX */}
          {/* {rule && <>({rule.alias ?? rule.title})</>} */}
        </Txt>
        <Expand />
      </Row>
      {report.reason && (
        <Row>
          <ArrowRightIcon />
          <Txt>{report.reason}</Txt>
        </Row>
      )}
      {renderAction()}
    </Box>
  );
}
