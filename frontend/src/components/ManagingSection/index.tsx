"use client";

import React, { Fragment } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { Row, Col, Box, Gap, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CheckIcon, DeleteOlIcon, ReportIcon, UnfoldIcon } from "@/ui/icons";
import { ReportItem } from "@/components/ReportItem";
import { ReportSummary } from "@/components/ReportSummary";
import { vizTime } from "@/utils/time";
import { ManagingLogItem } from "./ManagingLogItem";
// logic
import { useState, MouseEvent } from "react";
import * as PostApi from "@/apis/posts";
import * as CommentApi from "@/apis/comments";
import * as PostManagingLogApi from "@/apis/post_managing_logs";
import * as CommentManagingLogApi from "@/apis/comment_managing_logs";
import { useSnackbar } from "@/hooks/Snackbar";
import { DeleteReasonDialog } from "./DeleteReasonDialog";
import type {
  PostT, CommentT,
  PostReportT, CommentReportT,
  PostManagingLogT, CommentManagingLogT,
} from "@/types";

interface ManagableT extends BaseModelT {
  published_at?: Date | null;
  rewrite_at?: Date | null;
  trashed_by?: "admin" | "manager" | null
  trashed_at?: Date | null;
  approved_at?: Date | null;
  // manager fields
  reports?: (CommentReportT | PostReportT)[];
  num_ignored_report?: number;
  num_resolved_report?: number;
}


interface ManagingSectionProps {
  type: "post" | "comment";
  item: ManagableT;
  onUpdated: (item: ManagableT) => void;
}

export function ManagingSection({
  type,
  item,
  onUpdated,
}: ManagingSectionProps): JSX.Element {
  const t = useTranslations("components.ManagingSection");
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const [summaryOpen, setSummaryOpen] = useState<undefined | "resolved" | "ignored">();
  const [logs, setLogs] = useState<(PostManagingLogT | CommentManagingLogT)[]>([]);
  const [reasonDialogOpen, setReasonDialogOpen] = useState<boolean>(false);

  async function handleApproveClick(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    if (item.approved_at) {
      return;
    }
    try {
      if (type == "post") {
        const post = item as PostT;
        const { post: updated } = await PostApi.approve(post.id);
        onUpdated({ ...item, ...updated });
      }
      if (type == "comment") {
        const comment = item as CommentT;
        const { comment: updated } = await CommentApi.approve(comment.id);
        onUpdated({ ...comment, ...updated });
      }
      enqueueSnackbar(t("approveSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("approveFailed"), { variant: "error" });
    }
  }

  function handleTrashClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    if (item.trashed_at) {
      return;
    }
    setReasonDialogOpen(true);
  }

  async function handleTrashReasonOkClick(reason: string): Promise<void> {
    try {
      if (type == "post") {
        const post = item as PostT;
        const { post: updated } = await PostApi.trash(post.id, reason);
        onUpdated({ ...post, ...updated });
      }
      if (type == "comment") {
        const comment = item as CommentT;
        const { comment: updated } = await CommentApi.trash(comment.id, reason);
        onUpdated({ ...comment, ...updated });
      }
      enqueueSnackbar( t("deleteSuccess"), { variant: "success" });
      setReasonDialogOpen(false);
    } catch (e) {
      enqueueSnackbar(t("deleteFailed"), { variant: "error" });
      console.warn(e);
    }
  }

  function handleReasonDialogClose(): void {
    setReasonDialogOpen(false);
  }


  async function handleManagingLogMoreClick(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    try {
      if (type == "post") {
        const post = item as PostT;
        const { data } = await PostManagingLogApi.list({ postId: post.id, $author: true });
        setLogs(data);
      }
      if (type == "comment") {
        const comment = item as CommentT;
        const { data } = await CommentManagingLogApi.list({ commentId: comment.id, $author: true });
        setLogs(data);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  function handleExpandIgnoredClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setSummaryOpen("ignored");
  }

  function handleExpandResolvedClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setSummaryOpen("resolved");
  }


  const { downSm } = useResponsive();

  function renderReportSection(): JSX.Element {
    if (summaryOpen) {
      return (
        <ReportSummary
          type={type}
          targetId={item.id}
          initFilterType={summaryOpen}
        />
      );
    }
    return (
      <Box width='100%'>
        {item.reports?.map((report) => {
          return (
            <ReportItem
              type={type}
              key={report.id}
              report={report}
            />
          );
        })}
        <div>
          {Boolean(item.num_ignored_report) && (
            <Button
              onClick={handleExpandIgnoredClick}
              size={downSm ? "small" : "medium"}
            >
              +{t("ignoredReports", { n: item.num_ignored_report })}
            </Button>
          )}
          {Boolean(item.num_resolved_report) && (
            <Button
              onClick={handleExpandResolvedClick}
              size={downSm ? "small" : "medium"}
            >
              +{t("resolvedReports", { n: item.num_resolved_report })}
            </Button>
          )}
        </div>
      </Box>
    );
  }

  function renderManagingSection(): JSX.Element {
    const historyBtn =
      logs.length > 0 ? (
        <></>
      ) : (
        <Button
          startIcon={<UnfoldIcon />}
          size='small'
          onClick={handleManagingLogMoreClick}
        >
          {t("managingHistory")}
        </Button>
      );
    if (item.approved_at) {
      return (
        <>
          <Row>
            <Button
              size='small'
              variant='contained'
              disableRipple
              disableElevation
              disableFocusRipple
              disableTouchRipple
              color='success'
              startIcon={<CheckIcon />}
            >
              {t("approved")}
            </Button>
            <Gap x={1} />
            <Txt
              color='vague.main'
              variant='body3'
            >
              {vizTime(item.approved_at, { type: "relative", locale })}
            </Txt>
            <Expand />
            {historyBtn}
            <Button
              size='small'
              color='error'
              startIcon={<DeleteOlIcon />}
              onClick={handleTrashClick}
            >
              {t("trash")}
            </Button>
          </Row>
        </>
      );
    }
    if (item.trashed_at) {
      return (
        <>
          <Row>
            <Button
              size='small'
              color='error'
              variant='contained'
              disableRipple
              disableElevation
              disableFocusRipple
              disableTouchRipple
              startIcon={<DeleteOlIcon />}
            >
              { item.trashed_by == "admin" ? t("trashedByAdmin") : t("trashed")}
            </Button>
            <Gap x={1} />
            <Txt
              color='vague.main'
              variant='body3'
            >
              {vizTime(item.trashed_at, { type: "relative", locale })}
            </Txt>
            <Expand />
            {historyBtn}
            {item.trashed_by !== "admin" && (
              <Button
                size='small'
                color='success'
                startIcon={<CheckIcon />}
                onClick={handleApproveClick}
              >
                {t("approve")}
              </Button>
            )}
          </Row>
          {/* {downSm && <Row justifyContent='flex-end'>{historyBtn}</Row>} */}
        </>
      );
    }
    return (
      <Row>
        <Button
          size='small'
          color='success'
          startIcon={<CheckIcon />}
          onClick={handleApproveClick}
        >
          {t("approve")}
        </Button>
        <Gap x={1} />
        <Button
          size='small'
          color='error'
          startIcon={<DeleteOlIcon />}
          onClick={handleTrashClick}
        >
          {t("trash")}
        </Button>
      </Row>
    );
  }

  function renderManagingLogSection(): JSX.Element {
    return (
      <Col width='100%' rowGap={0.5}>
        {logs.map((log) => {
          return (
            <Fragment key={log.id}>
              <ManagingLogItem managingLog={log} />
            </Fragment>
          );
        })}
      </Col>
    );
  }

  return (
    <>
      <Box
        onClick={(e): void => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {renderManagingSection()}

        <Gap y={1} />

        {renderManagingLogSection()}

        {Boolean(item.reports?.length) && (
          <Row my={1}>
            <ReportIcon />
            <Gap x={1} />
            <Txt variant='subtitle2'>{t("reportList")}</Txt>
          </Row>
        )}

        {renderReportSection()}
      </Box>
      <DeleteReasonDialog
        open={reasonDialogOpen}
        onClose={handleReasonDialogClose}
        onSubmit={handleTrashReasonOkClick}
      />
    </>
  );
}
