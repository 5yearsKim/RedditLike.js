"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Tabs, Tab, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Container, Gap, Row, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { PostReportSection } from "./PostReportSection";
import { CommentReportSection } from "./CommentReportSection";
import { NoRightIndicator } from "../../NoRightIndicator";
// logic
import { useState, SyntheticEvent } from "react";
import { atom, useRecoilState } from "recoil";
import { SelectChangeEvent } from "@mui/material";
import { useBoardMain$ } from "@/stores/BoardMainStore";
import type { ReportFilterT } from "@/types";

// local recoil state
const reportFilterState = atom<ReportFilterT>({
  key: "reportFilter_ManagingReport",
  default: "unprocessed",
});

export function ReportTab(): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ReportTab");
  const boardMain$ = useBoardMain$();
  const [tab, setTab] = useState<"comment" | "post">("post");

  const [reportFilter, setReportFilter] = useRecoilState(reportFilterState);

  function handleTabChange(e: SyntheticEvent, value: string): void {
    e.preventDefault();
    setTab(value as any);
  }

  function handleReportFilterChange(e: SelectChangeEvent): void {
    setReportFilter(e.target.value as ReportFilterT);
  }

  const { manager, board } = boardMain$.data!;

  if (!manager?.manage_censor) {
    return <NoRightIndicator title={t("reports")} />;
  }

  return (
    <Container rtlP>
      <Txt variant='h5'>{t("reports")}</Txt>

      <Gap y={2} />

      <Row>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          // variant='fullWidth'
        >
          <Tab
            value='post'
            label={t("postReport")}
          />
          <Tab
            value='comment'
            label={t("commentReport")}
          />
        </Tabs>

        <Expand />
        <FormControl>
          <InputLabel>{t("status")}</InputLabel>
          <Select
            size='small'
            value={reportFilter}
            label={t("status")}
            variant='outlined'
            onChange={handleReportFilterChange}
          >
            <MenuItem value='unprocessed'>{t("unprocessed")}</MenuItem>
            <MenuItem value='all'>{t("all")}</MenuItem>
            <MenuItem value='ignored'>{t("ignored")}</MenuItem>
            <MenuItem value='resolved'>{t("resolved")}</MenuItem>
          </Select>
        </FormControl>
      </Row>

      <Gap y={2} />

      <Container maxWidth='sm'>
        {tab === "post" && (
          <PostReportSection
            boardId={board.id}
            reportFilter={reportFilter}
            manager={manager}
          />
        )}
        {tab === "comment" && (
          <CommentReportSection
            boardId={board.id}
            reportFilter={reportFilter}
            manager={manager}
          />
        )}
      </Container>
    </Container>
  );
}
