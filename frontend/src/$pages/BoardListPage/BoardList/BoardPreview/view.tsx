import React, { Fragment, ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/Responsive";
import { PostMiniPreview } from "@/components/PostMiniPreview";
import { BoardMenuButton } from "@/components/BoardMenuButton";
import { StarIcon, BlockIcon } from "@/ui/icons";
import { Row, Col, Gap, Box, Expand } from "@/ui/layouts";
import { Txt, EllipsisTxt } from "@/ui/texts";
import { Clickable } from "@/ui/tools/Clickable";
import { Tooltip } from "@/ui/tools/Tooltip";
import { BoardAvatar } from "@/ui/tools/Avatar";
import { HoverableBox } from "@/ui/tools/HoverableBox";
import { shortenNumber } from "@/utils/formatter";

// logic
import { useMe } from "@/stores/UserStore";
import type { BoardT } from "@/types/Board";
import { updateBoardEv } from "@/system/global_events";


export type BoardPreviewProps = {
  board: BoardT;
};

export function BoardPreviewView({
  board,
}: BoardPreviewProps): ReactNode {
  const t = useTranslations("pages.BoardListPage.BoardList.BoardPreview");
  const locale = useLocale();

  const me = useMe();

  function handleBoardUpdated(board: BoardT): void {
    updateBoardEv.emit(board);
  }

  const router = useRouter();
  const { downSm } = useResponsive();

  let posts = board.posts ?? [];
  if (downSm && posts.length > 3) {
    posts = posts.slice(0, 3);
  }

  function renderStarOrBlock(): ReactNode {
    if (!me) {
      return null;
    }
    if (Boolean(board.block)) {
      return (
        <Tooltip title={t("blocked")}>
          <BlockIcon color='error' />
        </Tooltip>
      );
    }
    return (
      <Row>
        {Boolean(board.follower) ? (
          <Tooltip title={t("subscribed")}>
            <StarIcon
              sx={{
                width: 16,
                height: 16,
                color: "yellow.main",
              }}
            />
          </Tooltip>
        ) : (
          <StarIcon
            sx={{
              width: 16,
              height: 16,
              color: "vague.main",
            }}
          />
        )}
        <Box mr={0.5} />
        <Txt
          fontWeight={700}
          variant='body2'
          color='vague.main'
        >
          {shortenNumber(board.num_follower, { locale })}
        </Txt>
      </Row>
    );
  }

  return (
    <HoverableBox
      bgcolor='paper.main'
      borderRadius={1}
      py={downSm ? 1 : 2}
      px={downSm ? 2 : 2}
      my={downSm ? 1 : 1}
    >
      {board.trashed_at && (
        <Row justifyContent='flex-end' width='100%'>
          <Txt
            variant='body3'
            fontWeight={700}
            color='error.main'
          >
            {t("hiddenByAdmin")}
          </Txt>
        </Row>
      )}
      <Row>
        <Row>
          <BoardAvatar
            board={board}
            size='22px'
          />

          <Gap x={1} />

          <Txt
            variant='body2'
            fontWeight={700}
          >
            {board.name}
          </Txt>
        </Row>

        <Expand />

        {renderStarOrBlock()}

        <BoardMenuButton
          board={board}
          onUpdated={handleBoardUpdated}
          size='small'
        />
      </Row>

      <EllipsisTxt maxLines={2} color='vague.main'>{board.description}</EllipsisTxt>

      <Box mt={{ xs: 1, sm: 2 }} />

      <Col width='100%'>
        {posts.map((post) => {
          return (
            <Fragment key={post.id}>
              <Clickable
                aria-label={"post-" + post.title}
                borderRadius={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/posts/${post.id}`);
                }}
              >
                <Box
                  p={0.5}
                  width='100%'
                >
                  <PostMiniPreview post={post} />
                </Box>
              </Clickable>
            </Fragment>
          );
        })}
      </Col>
      {(board.num_post - posts.length > 0) && (
        <Row
          justifyContent='flex-end'
          width='100%'
        >
          <Txt
            color='vague.main'
            variant='body3'
          >
            {t("plusPosts", { numMore: shortenNumber(board.num_post - posts.length, { locale }) })}
          </Txt>
        </Row>
      )}
    </HoverableBox>
  );
}
