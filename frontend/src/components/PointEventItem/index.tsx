import React from "react";
import { useLocale } from "next-intl";
import { Box, Row, Col, Gap, Expand } from "@/ui/layouts";
import { Txt, EllipsisTxt } from "@/ui/texts";
import { BoardAvatar } from "@/ui/tools/Avatar";
import { ViewIcon, VoteOlIcon } from "@/ui/icons";
import { usePostDialog } from "@/hooks/dialogs/PostDialog";
import { Tooltip } from "@/ui/tools/Tooltip";
import { Clickable } from "@/ui/tools/Clickable";
import { red, blue } from "@mui/material/colors";

import { vizTime } from "@/utils/time";
import type { PointEventT, PostSummaryPointEventFormT } from "@/types";

type PointEventItemProps = {
  pointEvent: PointEventT;
};

export function PointEventItem(props: PointEventItemProps): JSX.Element {
  const { pointEvent } = props;

  if (pointEvent.type == "post_summary") {
    return <PostSummaryPointEventItem pointEvent={pointEvent as any} />;
  }

  return <div>event</div>;
}

type PostSummaryPointEventItemProps = {
  pointEvent: PointEventT & PostSummaryPointEventFormT;
};

function PostSummaryPointEventItem({ pointEvent }: PostSummaryPointEventItemProps): JSX.Element {
  const locale = useLocale();

  const arg = pointEvent.arg as PostSummaryPointEventFormT["arg"];

  const post = pointEvent.post!;

  const { openPostDialog } = usePostDialog();

  function handlePostClick(): void {
    openPostDialog(post);
  }

  return (
    <Col
      my={1}
      rowGap={0.5}
    >
      {post.board && (
        <Row>
          <BoardAvatar
            board={post.board}
            size='20px'
          />
          <Gap x={1} />
          <Txt
            variant='body2'
            fontWeight={700}
          >
            {post.board.name}
          </Txt>
        </Row>
      )}

      <Row>
        <Clickable
          borderRadius={1}
          onClick={handlePostClick}
        >
          <EllipsisTxt
            maxLines={2}
            fontWeight={700}
            variant='subtitle1'
          >
            {post.title}
          </EllipsisTxt>
        </Clickable>
        <Box
          mx={0.5}
          color='vague.main'
        >
          ·
        </Box>
        <Tooltip title={vizTime(post.created_at, { type: "absolute", locale })}>
          <div>
            <Txt
              whiteSpace='pre'
              color='vague.main'
              variant='body2'
            >
              {vizTime(post.created_at, { type: "relative", locale })}
            </Txt>
          </div>
        </Tooltip>
      </Row>

      <Row>
        <Row gap={2}>
          <Row gap={0.5}>
            <ViewIcon
              fontSize='small'
              sx={{ color: "vague.main" }}
            />
            {arg.num_check > 0 && (
              <Txt
                color={red[400]}
                variant='body2'
                fontWeight={700}
              >
                (+{arg.num_check})
              </Txt>
            )}
          </Row>

          <Row gap={0.5}>
            <VoteOlIcon
              fontSize='small'
              sx={{ color: "vague.main" }}
            />
            {arg.score > 0 && (
              <Txt
                color={red[400]}
                variant='body2'
                fontWeight={700}
              >
                (+{arg.score})
              </Txt>
            )}
            {arg.score < 0 && (
              <Txt
                color={blue[400]}
                variant='body2'
                fontWeight={700}
              >
                ({arg.score})
              </Txt>
            )}
          </Row>
        </Row>

        <Expand />

        <Txt
          color={red[400]}
          variant='subtitle2'
        >
          + {pointEvent.points.toLocaleString()} p
        </Txt>
      </Row>
    </Col>
  );
}
