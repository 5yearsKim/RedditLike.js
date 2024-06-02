"use client";

import React, { ReactNode, useState, useEffect, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@mui/material";
import { Row, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BlockIcon } from "@/ui/icons";
// logic
import { useHover } from "@/hooks/Hover";
import * as BoardFollowerApi from "@/apis/board_followers";
import { useMe } from "@/stores/UserStore";
import { useFollowingBoardsStore, getFollowingBoardsListOpt } from "@/stores/FollowingBoardsStore";
import { useSnackbar } from "@/hooks/Snackbar";
import type { BoardT } from "@/types";

type BoardFollowButtonProps = {
  board: BoardT;
  size?: "small" | "medium" | "large";
  minWidth?: string | number;
};

export function BoardFollowButton({
  board,
  size,
  minWidth,
}: BoardFollowButtonProps): ReactNode {
  const t = useTranslations("pages.BoardMainPage.BoardFollowButton");
  const [isHover, hoverProps] = useHover();
  const { enqueueSnackbar } = useSnackbar();

  const me = useMe();
  const followingListOpt = getFollowingBoardsListOpt({ userId: me?.id });
  const { actions: followingBoardsAct } = useFollowingBoardsStore();

  const [isFollow, setIsFollow] = useState<boolean>(Boolean(board.follower));

  useEffect(() => {
    setIsFollow(Boolean(board.follower));
  }, [board.id, board.follower]);

  async function handleFollowClick(e: MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    try {
      await BoardFollowerApi.follow(board.id);
      setIsFollow(true);
      followingBoardsAct.load(followingListOpt, { force: true });

      enqueueSnackbar(t("subscribeSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("subscribeFailed"), { variant: "error" });
    }
  }

  async function handleUnfollowClick(e: MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    try {
      await BoardFollowerApi.unfollow(board.id);
      setIsFollow(false);
      followingBoardsAct.load(followingListOpt, { force: true });

      enqueueSnackbar(t("unsubscribeSuccess"), { variant: "info" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("unsubscribeFailed"), { variant: "error" });
    }
  }

  if (board.block) {
    return (
      <Box px={2}>
        <Row>
          <BlockIcon color='error' />
          <Box mr={0.5} />
          <Txt color='error'>{t("blocked")}</Txt>
        </Row>
      </Box>
    );
  }

  if (isFollow) {
    return (
      <Button
        {...hoverProps}
        onClick={handleUnfollowClick}
        variant='contained'
        size={size}
        sx={{
          borderRadius: 16,
          // minWidth: downSm ? 80 : 100,
          minWidth: minWidth,
          whiteSpace: "nowrap",
        }}
      >
        {isHover ? t("unsubscribe") : t("subscribed")}
      </Button>
    );
  } else {
    return (
      <Button
        {...hoverProps}
        onClick={handleFollowClick}
        variant='outlined'
        size={size}
        sx={{
          borderRadius: 16,
          // minWidth: downSm ? 80 : 100,
          minWidth: minWidth,
        }}
      >
        {t("subscribe")}
      </Button>
    );
  }
}
