"use client";

import React, { useState, useMemo, Fragment } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Paper, Button, Radio, IconButton, useTheme } from "@mui/material";
import { Box, Col, Row, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ArrowForwardIcon, CheckIcon, EditIcon } from "@/ui/icons";
import { Tooltip } from "@/ui/tools/Tooltip";
import { Clickable } from "@/ui/tools/Clickable";
import { EditPollDialog } from "./EditPollDialog";
import * as PollVoteApi from "@/apis/poll_votes";
import * as PollCandApi from "@/apis/poll_cands";
import { useSnackbar } from "@/hooks/Snackbar";
import { useLoginAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { buildImgUrl } from "@/utils/media";
import { vizTime } from "@/utils/time";
import { useMe } from "@/stores/UserStore";
import { useResponsive } from "@/hooks/Responsive";
import { PollT, PollCandT } from "@/types";


type PollItemProps = {
  poll: PollT,
  cands: PollCandT[],
  isEditable?: boolean
  onPollUpdated: (poll: PollT) => void
  onCandsUpdated: (cands: PollCandT[]) => void
}

export function PollItem({
  poll,
  cands,
  isEditable,
  onPollUpdated,
  onCandsUpdated,
}: PollItemProps): JSX.Element {
  const t = useTranslations("components.PollItem");
  const locale = useLocale();

  const isExpired = useMemo(() => {
    if (!poll.expires_at) {
      return false;
    }
    return new Date(poll.expires_at) < new Date();
  }, []);
  const theme = useTheme();
  const { downSm } = useResponsive();
  const me = useMe();
  const [selected, setSelected] = useState<idT[]>([]);
  const [mode, setMode] = useState<"vote"|"result">(
    (isExpired || cands.some((item) => Boolean(item.my_vote))) ? "result" : "vote"
  );
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { showLoginAlertDialog } = useLoginAlertDialog();


  const submitDisabled = selected.length == 0 || isSubmitting;

  const maxCnt = useMemo(() => {
    let max = 0;
    cands.forEach((cand) => {
      if ((cand.num_vote ?? 0) > max) {
        max = cand.num_vote ?? 0;
      }
    });
    return max;
  }, [cands]);

  function handleCandClick(cand: PollCandT): void {
    if (selected.includes(cand.id)) {
      setSelected(selected.filter((id) => id !== cand.id));
      return;
    } else {
      if (poll.allow_multiple) {
        setSelected([...selected, cand.id]);
      } else {
        setSelected([cand.id]);
      }
    }
  }

  async function handleVote(): Promise<void> {
    if (!me) {
      showLoginAlertDialog();
      return;
    }
    try {
      setIsSubmitting(true);
      await PollVoteApi.vote(poll.id, selected );
      const { data: cands } = await PollCandApi.list({ pollId: poll.id, $my_vote: true, $num_vote: true });
      onCandsUpdated(cands);
      setIsSubmitting(false);
      setMode("result");
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("voteFailed"), { variant: "error" });
      setIsSubmitting(false);
    }
  }

  function handleShowResultClick(): void {
    if (!me) {
      showLoginAlertDialog();
      return;
    }
    setMode("result");
  }

  function handleVoteAgainClick(): void {
    setMode("vote");
  }

  function handleEditClick(): void {
    setIsEditorOpen(true);
  }

  function handleEditorClose(): void {
    setIsEditorOpen(false);
  }

  async function handleEditorUpdated(updated: PollT): Promise<void> {
    try {
      const { data: cands } = await PollCandApi.list({ pollId: poll.id, $my_vote: true, $num_vote: true });
      onPollUpdated(updated);
      onCandsUpdated(cands);
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <>
      <Paper elevation={4}>
        <Col
          py={downSm ? 1.5 : 2}
          px={downSm ? 1.5 : 2}
        >
          <Row width='100%'>
            <Txt variant="h6">{poll.title}</Txt>
            <Expand/>
            {isEditable && (
              <>
                <Tooltip title={t("edit")}>
                  <IconButton size='small' onClick={handleEditClick}>
                    <EditIcon/>
                  </IconButton>
                </Tooltip>

                <EditPollDialog
                  poll={poll}
                  cands={cands}
                  open={isEditorOpen}
                  onUpdated={handleEditorUpdated}
                  onClose={handleEditorClose}
                />
              </>
            )}
          </Row>

          {poll.description?.length ? (
            <Box my={1}>
              <Txt color='vague.main'>{poll.description}</Txt>
            </Box>
          ) : (
            <Gap y={1}/>
          )}

          {mode == "vote" ? (
            <Col alignItems='flex-end' >
              {poll.allow_multiple && (
                <Txt variant='body3'>*{t("allowMultiple")}</Txt>
              )}
              {poll.expires_at && (
                <Txt variant='body3'>*{t("untilTime", { until: vizTime(poll.expires_at, { type: "absolute", locale }) })}</Txt>
              )}
            </Col>
          ) : (
            <Col alignItems='flex-end' >
              {isExpired && (
                <Txt variant='body3'>*{t("untilTime", { until: vizTime(poll.expires_at, { type: "absolute", locale }) })}</Txt>
              )}
            </Col>
          )}

          <Gap y={1}/>

          { mode == "vote" ? (

            <Col rowGap={1} >
              {cands.map((cand) => {
                const isSelected = selected.includes(cand.id);
                return (
                  <Fragment key={cand.id}>
                    <Row
                      width='100%'
                      onClick={() => handleCandClick(cand)}
                    >
                      <Radio
                        checked={isSelected}
                        // checked={false}
                        size='small'
                        sx={{ m: 0, p: 0, pr: 1.5 }}
                      />
                      <Clickable
                        borderRadius={2}
                        border={`1px solid ${isSelected ? theme.palette.primary.main : "#bbbbbb "}`}
                        minHeight={50}
                        width='100%'
                      >
                        <Row width='100%' mx={1} columnGap={1.5}>
                          {cand.thumb_path && (
                            <Image
                              src={buildImgUrl(null, cand.thumb_path)}
                              alt={cand.thumb_path}
                              width={65}
                              height={65}
                              style={{ objectFit: "cover" }}
                            />
                          )}
                          <Txt variant="body1">{cand.label}</Txt>
                        </Row>
                      </Clickable>
                    </Row>
                  </Fragment>
                );
              })}
            </Col>
          ) : (
            <Col>
              {cands.map((cand) => {
                return (
                  <Fragment key={cand.id}>
                    <Row width='100%' my={1}>
                      {cand.thumb_path && (
                        <Box mr={2}>
                          <Image
                            src={buildImgUrl(null, cand.thumb_path)}
                            alt={cand.thumb_path}
                            width={60}
                            height={60}
                          />
                        </Box>
                      )}
                      <Col width='100%'>
                        <Row width='100%'>
                          <Txt>{cand.label}</Txt>
                          {cand.my_vote && (
                            <Tooltip title={t("myVote")}>
                              <CheckIcon sx={{ m: 1, color: "primary.main" }}/>
                            </Tooltip>
                          )}
                          <Expand/>
                          <Txt>{cand.num_vote}</Txt>
                        </Row>

                        <Row
                          bgcolor='vague.light'
                          width='100%'
                          borderRadius={1}
                          height={10}
                        >
                          <Box
                            width={maxCnt == 0 ? "0%" : `${(cand.num_vote ?? 0) / maxCnt * 100}%`}
                            height={"100%"}
                            bgcolor='primary.main'
                            borderRadius={1}
                          />
                        </Row>
                      </Col>
                    </Row>
                  </Fragment>
                );
              })}
            </Col>
          )}

          <Gap y={2}/>

          <Row >
            {mode == "vote" ? (
              <Button
                endIcon={<ArrowForwardIcon fontSize='small'/>}
                onClick={handleShowResultClick}
              >
                {t("previewResult")}
              </Button>
            ) : (
              <Button onClick={handleVoteAgainClick}>
                {t("voteAgain")}
              </Button>
            )}
            <Expand/>
            {mode == "vote" && (
              <Button
                variant="contained"
                disabled={submitDisabled}
                onClick={handleVote}
              >
                {t("submit")}
              </Button>
            )}
          </Row>

        </Col>
      </Paper>
      {/* <PollEditor poll={poll}/> */}
    </>
  );

}