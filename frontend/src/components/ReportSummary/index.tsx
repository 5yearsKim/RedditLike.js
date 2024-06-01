import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { InitBox, LoadingIndicator, ErrorBox } from "@/components/$statusTools";
import { ReportItem } from "@/components/ReportItem";
// logic
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import * as PostReportApi from "@/apis/post_reports";
import * as CommentReportApi from "@/apis/comment_reports";
import type { PostReportT, CommentReportT } from "@/types";


type FilterTypeT = "all" | "ignored" | "resolved";

type ReportSummaryProps = {
  type: "comment" | "post";
  targetId: idT;
  initFilterType?: FilterTypeT;
};

export function ReportSummary({
  type,
  targetId,
  initFilterType,
}: ReportSummaryProps): JSX.Element {
  const t = useTranslations("components.ReportSummary");

  const [status, setStatus] = useState<ProcessStatusT>("init");
  const [reports, setReports] = useState<(PostReportT | CommentReportT)[]>([]);
  const [filter, setFilter] = useState<FilterTypeT>(initFilterType ?? "all");

  const filtered = useMemo(() => {
    if (filter === "ignored") {
      return reports.filter((report) => Boolean(report.ignored_at));
    }
    if (filter === "resolved") {
      return reports.filter((report) => Boolean(report.resolved_at));
    }
    return reports;
  }, [filter, reports]);

  async function init(): Promise<void> {
    try {
      setStatus("loading");
      if (type === "post") {
        const { data: fetched } = await PostReportApi.list({ postId: targetId });
        setReports(fetched);
      }
      if (type === "comment") {
        const { data: fetched } = await CommentReportApi.list({
          commentId: targetId,
        });
        setReports(fetched);
      }
      setStatus("loaded");
    } catch (e) {
      setStatus("error");
    }
  }

  useEffect(() => {
    init();
  }, [filter]);

  function handleFilterChange(e: ChangeEvent<HTMLInputElement>): void {
    e.stopPropagation();
    // e.preventDefault();
    setFilter(e.target.value as FilterTypeT);
  }

  function handleErrorRetry(): void {
    init();
  }

  if (status === "init") {
    return <InitBox />;
  }
  if (status === "loading") {
    return <LoadingIndicator />;
  }
  if (status === "error") {
    return <ErrorBox onRetry={handleErrorRetry} />;
  }

  return (
    <Fragment>
      <FormControl>
        <FormLabel>{t("processStatus")}</FormLabel>
        <RadioGroup
          onClick={(e): void => e.stopPropagation()} // for radio button to work
          value={filter}
          onChange={handleFilterChange}
          row
        >
          <FormControlLabel
            value='all'
            control={<Radio />}
            label={t("all")}
          />
          <FormControlLabel
            value='ignored'
            control={<Radio />}
            label={t("ignored")}
          />
          <FormControlLabel
            value='resolved'
            control={<Radio />}
            label={t("resolved")}
          />
        </RadioGroup>
      </FormControl>
      <Box width='100%'>
        {filtered.length == 0 ? (
          <Txt
            color='vague.main'
            textAlign='center'
          >
            {t("noRreport")}
          </Txt>
        ) : (
          filtered.map((report) => {
            return (
              <ReportItem
                key={report.id}
                type={type}
                report={report}
              />
            );
          })
        )}
      </Box>
    </Fragment>
  );
}
