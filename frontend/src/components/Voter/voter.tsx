"use client";

import React, { useState, useEffect, useMemo, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import { ThumbUpOlIcon, ThumbDownOlIcon } from "@/ui/icons";
import { Tooltip } from "@/ui/tools/Tooltip";
import { Clickable } from "@/ui/tools/Clickable";
import { deepOrange, blue } from "@mui/material/colors";

import { useSnackbar } from "@/hooks/Snackbar";
import { useMe } from "@/stores/UserStore";
import { useLoginAlertDialog } from "@/hooks/dialogs/ConfirmDialog";

const upColor = deepOrange[500];
const downColor = blue[700];

type VoterProps = {
  isHorizontal?: boolean;
  numVote: number;
  score: number;
  myScore?: number | null;
  size?: "medium" | "small";
  onVote: (score: number) => any;
};

export function Voter({
  isHorizontal,
  numVote,
  score,
  myScore: myInitScore,
  size = "medium",
  onVote,
}: VoterProps): JSX.Element {
  const t = useTranslations("components.Voter");

  const me = useMe() ;
  const { showLoginAlertDialog } = useLoginAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const [myScore, setMyScore] = useState<number>(myInitScore ?? 0);

  const baseScore = useMemo(() => {
    return score - (myInitScore ?? 0);
  }, [score, myInitScore]);

  useEffect(() => {
    if (myInitScore != myScore) {
      setMyScore(myInitScore ?? 0);
    }
  }, [myInitScore]);

  async function handleVote(e: MouseEvent<HTMLElement>, vote: number): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    if (!me) {
      showLoginAlertDialog();
      return;
    }
    if (![1, -1].includes(vote)) {
      return;
    }
    if (vote === myScore) {
      vote = 0;
    }
    try {
      setMyScore(vote);
      await onVote(vote);
    } catch (e: any) {
      if (e == "VOTE_MINE") {
        setMyScore(myScore);
      } else {
        console.warn(e);
        setMyScore(myScore);
        enqueueSnackbar(t("pleaseCheckNetwork"), { variant: "error" });
      }
    }
  }


  const totalScore = baseScore + myScore;

  const numUp = Math.ceil((numVote + baseScore) / 2) + (myScore == 1 ? 1 : 0);
  const numDown = Math.ceil((numVote - baseScore) / 2) + (myScore == -1 ? 1 : 0);

  let iconSize = 24;
  let iconPadding = 0.5;

  if (size == "small") {
    iconSize = 20;
    iconPadding = 0.4;
  }

  return (
    <Box
      display='flex'
      flexDirection={isHorizontal ? "row" : "column"}
      alignItems='center'
    >
      <Clickable
        aria-label='upvote-button'
        borderRadius={0.5}
        p={iconPadding}
        onClick={(e): Promise<void> => handleVote(e, 1)}
      >
        <ThumbUpOlIcon
          sx={{
            fontSize: iconSize,
            color: myScore === 1 ? upColor : "vague.light",
          }}
        />
      </Clickable>

      <Tooltip
        // title={`👍 ${numUp} 👎 ${numDown}`}
        title={`up ${numUp} / down ${numDown}`}
        placement={myScore > 0 ? "top" : "bottom"}
        arrow
        // disabled={myScore == 0}
      >
        <Box
          minWidth='26px'
          textAlign='center'
          sx={{
            color: myScore === 1 ? upColor : myScore === -1 ? downColor : totalScore < 0 ? "vague.light" : "vague.main",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          {totalScore}
        </Box>
      </Tooltip>

      <Clickable
        aria-label='downvote-button'
        borderRadius={0.5}
        p={iconPadding}
        onClick={(e): Promise<void> => handleVote(e, -1)}
      >
        <ThumbDownOlIcon
          sx={{
            fontSize: iconSize,
            color: myScore === -1 ? downColor : "vague.light",
          }}
        />
      </Clickable>
    </Box>
  );
}
