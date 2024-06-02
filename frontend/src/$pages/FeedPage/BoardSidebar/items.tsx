import React, { Fragment, MouseEvent, useState, useEffect, ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Box, IconButton, ListItemButton } from "@mui/material";
import { CloseIcon } from "@/ui/icons";
import { Row, Col, Gap, Expand, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardAvatar } from "@/ui/tools/Avatar";
import { ListView } from "@/ui/tools/ListView";
import { LoadingIndicator, ErrorButton } from "@/components/$statusTools";

import { useMe } from "@/stores/UserStore";
import { useRecentBoards, useRecentBoardsActions } from "@/stores/RecentBoardsStore";
import { useFollowingBoardsStore, getFollowingBoardsListOpt } from "@/stores/FollowingBoardsStore";
import { useHotBoardsStore, getHotBoardsListOpt } from "@/stores/HotBoardsStore";
import type { BoardT } from "@/types";

function BoardButtonItem({
  board,
  tail,
  head,
}: {
  board: BoardT;
  tail?: ReactNode;
  head?: ReactNode;
}): ReactNode {
  return (
    <Link href={`/boards/${board.id}`} style={{ width: "100%" }}>
      <ListItemButton>
        <Row
          width='100%'
          py={0.25}
        >
          {head && head}

          <BoardAvatar
            board={board}
            size='24px'
          />

          <Gap x={1} />

          <Expand>
            <Txt variant='body1'>{board.name}</Txt>
          </Expand>

          {tail && tail}
        </Row>
      </ListItemButton>
    </Link>
  );
}

export function HotBoardList(): JSX.Element {
  const { data: hotBoards$, actions: hotBoardsAct } = useHotBoardsStore();
  const me = useMe();

  const listOpt = getHotBoardsListOpt({ userId: me?.id });

  useEffect(() => {
    hotBoardsAct.load(listOpt);
  }, [JSON.stringify(listOpt)]);

  const { data: hotBoards, status } = hotBoards$;

  if (status == "init") {
    return <></>;
  }
  if (status == "loading") {
    return (
      <LoadingIndicator
        width='100%'
        size='2rem'
      />
    );
  }
  return (
    <>
      {hotBoards.map((board, idx) => {
        return (
          <Fragment key={board.id}>
            <BoardButtonItem
              board={board}
              head={
                <Box mr={1}>
                  <Txt
                    variant='body2'
                    fontWeight={700}
                  >
                    {idx + 1}.
                  </Txt>
                </Box>
              }
            />
          </Fragment>
        );
      })}
    </>
  );
}

export function FollowingBoardList(): JSX.Element {
  const t = useTranslations("pages.FeedPage.BoardSidebar");
  const me = useMe();
  const { data: followingBoards$, actions: followingBoardsAct } = useFollowingBoardsStore();

  const listOpt = getFollowingBoardsListOpt({ userId: me?.id });

  useEffect(() => {
    followingBoardsAct.load(listOpt);
  }, [me?.id]);

  function handleLoaderDetect(): void {
    followingBoardsAct.refill();
  }

  function handleErrorRetry(): void {
    followingBoardsAct.load(listOpt, { force: true });
  }

  const { status, data: boards } = followingBoards$;

  if (status === "init") {
    return <></>;
  }
  if (status === "loading") {
    return (
      <Center>
        <LoadingIndicator size='2rem' />
      </Center>
    );
  }
  if (status === "error") {
    return (
      <Center>
        <ErrorButton onRetry={handleErrorRetry} />
      </Center>
    );
  }


  return (
    <Box
      sx={{
        overflowY: "scroll",
        maxHeight: "calc(100vh - 400px)",
      }}
    >

      {boards.length == 0 && (
        <Center my={1}>
          <Txt variant='body3' color='vague.light'>{t("noSubscribedBoards")}</Txt>
        </Center>
      )}

      <ListView
        data={boards}
        onLoaderDetect={handleLoaderDetect}
        renderItem={(board): JSX.Element => {
          return (
            <Fragment key={board.id}>
              <BoardButtonItem board={board} />
            </Fragment>
          );
        }}
      />
    </Box>
  );
}

export function RecentBoardList(): JSX.Element {
  const t = useTranslations("pages.FeedPage.BoardSidebar");
  const recentBoards$ = useRecentBoards();
  const recentBoardsAct = useRecentBoardsActions();

  const [tmp, setTmp] = useState<boolean>(false); // to prevent hydration error;

  const { data: recentBoards } = recentBoards$;

  useEffect(() => {
    setTmp(true);
  }, []);

  function handleDeleteClick(e: MouseEvent<HTMLButtonElement>, board: BoardT): void {
    e.preventDefault();
    e.stopPropagation();
    recentBoardsAct.removeById(board.id);
  }

  if (!tmp) {
    return <></>;
  }

  if (recentBoards.length == 0) {
    return (
      <Center my={1}>
        <Txt variant='body3' color='vague.light'>{t("noRecentBoards")}</Txt>
      </Center>
    );
  }
  return (
    <Col>
      {recentBoards.map((board) => {
        return (
          <Fragment key={board.id}>
            <BoardButtonItem
              board={board}
              tail={
                <IconButton
                  size='small'
                  aria-label='close-recent-board-item'
                  onClick={(e): void => handleDeleteClick(e, board)}
                >
                  <CloseIcon fontSize='small' />
                </IconButton>
              }
            />
          </Fragment>
        );
      })}
    </Col>
  );
}
