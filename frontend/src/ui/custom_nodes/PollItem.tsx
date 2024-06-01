import React, { useEffect, useState } from "react";
import { Skeleton, Paper } from "@mui/material";
import { Box, Col, Gap } from "@/ui/layouts";
import { ErrorBox } from "@/components/$statusTools";
import { PollItem as MyPollItem } from "@/components/PollItem";
import * as PollApi from "@/apis/polls";
import * as PollCandApi from "@/apis/poll_cands";


import type { PollT, PollCandT } from "@/types";


type PollItemProps = {
  pollId: idT
  isEditable?: boolean
}

export function PollItem({ pollId, isEditable }: PollItemProps): JSX.Element {
  const [status, setStatus] = useState<ProcessStatusT>("init");
  const [poll, setPoll] = useState<PollT | null>(null);
  const [cands, setCands] = useState<PollCandT[]>([]);

  useEffect(() => {
    _init();
  }, []);

  async function _init(): Promise<void> {
    try {
      setStatus("loading");
      const [
        { data: poll },
        { data: cands },
      ] = await Promise.all([
        PollApi.get(pollId, {}),
        PollCandApi.list({ pollId, $my_vote: true, $num_vote: true }),
      ]);
      setStatus("loaded");
      setPoll(poll);
      setCands(cands);
    } catch (e) {
      console.warn(e);
      setStatus("error");
    }
  }


  function renderItem(): JSX.Element {
    if (status == "init" || status == "loading") {
      return (
        <Paper>
          <Col p={1}>
            <Skeleton
              variant="text"
              width='100%'
              height={40}
            />
            <Gap y={1}/>
            {[1, 2, 3, 4].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width='100%'
                height={40}
                sx={{ my: 1 }}
              />
            ))}
          </Col>
        </Paper>
      );
    }
    if (status == "error") {
      return (
        <Paper>
          <Box p={1}>
            <ErrorBox
              message="투표 정보를 불러오는데 실패했어요."
              onRetry={() => _init()}
            />
          </Box>
        </Paper>
      );
    }
    if (!poll) {
      return (
        <Paper>
          <Box p={1}>
            <ErrorBox message="투표 정보를 찾을 수 없어요."/>
          </Box>
        </Paper>
      );
    }
    return (
      <MyPollItem
        poll={poll}
        cands={cands}
        isEditable={isEditable}
        onPollUpdated={(newPoll) => setPoll(newPoll)}
        onCandsUpdated={(newCands) => setCands(newCands)}
        // onVote={handleVote}
        // onResult={() => setIsResult(true)}
      />
    );
  }

  return (
    <Box
      className="select-visible"
      maxWidth={600}
      mx='auto'
    >
      {renderItem()}
    </Box>
  );
}