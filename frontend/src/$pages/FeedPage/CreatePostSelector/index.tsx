"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/Responsive";
import { Box, Popover, List, ListItemButton, TextField, useTheme } from "@mui/material";
import { BoardSearchItem } from "@/components/BoardSearchItem";
import { LoadingIndicator } from "@/components/$statusTools";
import { Row, Gap, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EditIcon } from "@/ui/icons";
import { Avatar } from "@/ui/tools/Avatar";
// logic
import { useState, useRef, useMemo, useEffect, MouseEvent, ChangeEvent } from "react";
import { useUrlState } from "@/hooks/UrlState";
import { useBoardSearch } from "@/hooks/BoardSearch";
import { useBoardMainActions } from "@/stores/BoardMainStore";
import { useGroup } from "@/stores/GroupStore";
import { useFollowingAllBoardsStore, getFollowingAllBoardsListOpt } from "@/stores/FollowingAllBoardsStore";
import type { UserT, BoardT } from "@/types";


type CreatePostSelectorProps = {
  me: UserT;
};

export function CreatePostSelector({ me }: CreatePostSelectorProps): JSX.Element {
  const t = useTranslations("pages.FeedPage.CreatePostSelector");
  const router = useRouter();
  const group = useGroup();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [boardSelectorEl, setBoardSelectorEl] = useState<HTMLDivElement | null>(null);
  const [boardSelectorOpen, setBoardSelectorOpen] = useUrlState<boolean>({
    key: "boardSelectorOpen",
    query2val: (query) => query === "true",
    val2query: (val) => val ? "true" : null,
    backOn: (val) => !val,
  });

  const boardMainAct = useBoardMainActions();

  const [query, setQuery] = useState<string>("");
  const { data: followingBoards$, actions: followingBoardsAct } = useFollowingAllBoardsStore();

  const { status: boardSearchStatus, boardCand, reset: resetBoardSearch } = useBoardSearch({ query });

  const candidates: BoardT[] = useMemo(() => {
    if (query.trim().length == 0) {
      return followingBoards$.data;
    } else {
      return boardCand;
    }
  }, [query, boardSearchStatus, followingBoards$.status]);

  useEffect(() => {
    const listOpt = getFollowingAllBoardsListOpt({ userId: me?.id, groupId: group.id });
    followingBoardsAct.load(listOpt);
  }, [me?.id, group.id]);

  function handleAvatarClick(): void {
    router.push("/activities/post");
  }

  function handleCreateClick(e: MouseEvent<HTMLDivElement>): void {
    setBoardSelectorEl(e.currentTarget);
    setBoardSelectorOpen(true);
  }

  function handlePopClose(): void {
    setBoardSelectorOpen(false);
  }

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>): void {
    setQuery(e.target.value);
  }

  function handleBoardClick(board: BoardT): void {
    boardMainAct.load({ id: board.id });
    resetBoardSearch();
    router.push(`/boards/${board.id}/create-post`);
  }

  const { downSm } = useResponsive();
  const theme = useTheme();

  const avatarSize = downSm ? 34 : 38;

  const boxWidth = boxRef.current ? boxRef.current.offsetWidth + 30 : undefined;

  const primaryColor = theme.palette.mode == "dark" ? theme.palette.primary.light : theme.palette.primary.main;
  return (
    <>
      <Row>
        <Avatar
          size={avatarSize}
          sx={{
            cursor: "pointer",
            "&:hover": {
              transition: "all .2s ease-in-out",
              boxShadow: `0px 0px 4px ${ primaryColor }`,
            },
          }}
          onClick={handleAvatarClick}
        />
        <Box mr={downSm ? 1 : 2} />
        <Box
          ref={boxRef}
          width='100%'
          bgcolor='paper.main'
          borderRadius={2}
          py={1}
          px={1}
          sx={{
            cursor: "pointer",
            boxShadow: "0px 0px 2px rgba(0,0,0, 0.1)",
            "&:hover": {
              transition: "all .2s ease-in-out",
              boxShadow: `0px 0px 4px ${primaryColor}`,
            },
          }}
          onClick={handleCreateClick}
        >
          <Row>
            <EditIcon sx={{ fontSize: 20, color: "vague.light" }} />
            <Gap x={1} />
            <Txt variant='body3' color='vague.main'>{t("whatsYourThought")}</Txt>
          </Row>
        </Box>
      </Row>
      <Popover
        open={boardSelectorOpen}
        anchorEl={boardSelectorEl}
        onClose={handlePopClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          mt: 1,
          maxHeight: 400,
          maxWidth: boxWidth,
          width: "100%",
        }}
      >
        <Box
          mt={1}
          mx={2}
          width={boxWidth ? boxWidth - 60 : undefined}
        >
          <Txt variant='subtitle2' fontWeight={700}>{t("whichBoard")}</Txt>
          <TextField
            value={query}
            onChange={handleQueryChange}
            fullWidth
            variant='standard'
            placeholder={t("searchWithKeywords")}
          />
        </Box>
        {/* </Box> */}
        {boardSearchStatus == "loading" ? (
          <Center
            width='100%'
            height='2rem'
          >
            <LoadingIndicator size='2rem' />
          </Center>
        ) : (
          <List>
            {candidates.map((item) => {
              return (
                <Fragment key={item.id}>
                  <ListItemButton onClick={(): void => handleBoardClick(item)}>
                    <BoardSearchItem board={item} />
                  </ListItemButton>
                </Fragment>
              );
            })}
          </List>
        )}
      </Popover>
    </>
  );
}
