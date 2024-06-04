"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Box, IconButton } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";

import { Container, Row, Gap, Expand } from "@/ui/layouts";
import { AddIcon, RetryIcon } from "@/ui/icons";
import { BoardSortChips } from "@/components/BoardSortChips";
import { FollowingSelector, type FollowingRangeT } from "@/components/FollowingSelector";
import { ScrollTopButton } from "@/ui/tools/ScrollTopButton";
import { CategoryFilterSelector } from "./CategoryFilterSelector";
import { BoardList } from "./BoardList";

// logic
import { atom, useRecoilState } from "recoil";
import { initFromStorage } from "@/utils/recoil";
import type { BoardSortT, ListBoardOptionT } from "@/types/Board";
import type { CategoryT } from "@/types/Category";
import { useAllBoardsStore } from "@/stores/AllBoardsStore";
import { useMe, useMeAdmin } from "@/stores/UserStore";
import { updateBoardEv } from "@/system/global_events";


// local recoil state
const sortState = atom<BoardSortT>({
  key: "sort_BoardListPage",
  default: "hot",
  effects: [
    initFromStorage<BoardSortT>("sort_BoardListPage_default", (val) => {
      if (val == "hot" || val == "recent" || val == "follower") {
        return val;
      } else {
        return "follower";
      }
    }),
  ],
});

const categoryIdState = atom<idT | null>({
  key: "categoryId_BoardListPate",
  default: null,
});

const followingState = atom<FollowingRangeT>({
  key: "following_BoardListPage",
  default: undefined,
  effects: [
    initFromStorage<FollowingRangeT>("following_BoardListPage_default", (val) => {
      if (val == "except" || val == "only") {
        return val;
      }
      if (val == "_all_") {
        return undefined;
      }
      return undefined; // default
    }),
  ],
});


export function BoardListPage(): JSX.Element {
  const t = useTranslations("pages.BoardListPage");
  const [sort, setSort] = useRecoilState(sortState);
  const [categoryId, setCategoryId] = useRecoilState(categoryIdState);
  const [following, setFollowing] = useRecoilState(followingState);
  const [regenCnt, setRegenCnt] = useState<number>(0);

  const { data: boards$, actions: boardsAct } = useAllBoardsStore();
  const searchParams = useSearchParams();
  const me = useMe();
  const admin = useMeAdmin();

  const { downSm } = useResponsive();
  const router = useRouter();

  // update listener
  useEffect(() => {
    updateBoardEv.addListener("boardListPage", (board) => {
      if (!boards$.data.some((item) => item.id == board.id)) {
        return;
      }
      boardsAct.replaceItem(board);
    });
    return (): void => updateBoardEv.removeListener("boardListPage");
  }, [boards$.data]);

  /**
   * sort?: 'recent'
   * refresh?: 'true'
   */
  useEffect(() => {
    const _sort = searchParams.get("sort") as BoardSortT | null;
    if (_sort) {
      setSort(_sort);
    }
    const _refresh = searchParams.get("refresh") == "true";
    if (_refresh) {
      setRegenCnt((prev) => prev + 1);
    }
  }, []);

  const listOpt: ListBoardOptionT = {
    $user_defaults: true,
    $posts: "recent",
    sort: sort,
    following: following,
    block: "except",
    categoryId: categoryId ?? undefined,
    censor: "exceptTrashed",
  };

  function handleErrorRetry(): void {
    boardsAct.load(listOpt, { force: true });
  }

  function handleSortChange(val: BoardSortT): void {
    setSort(val);
  }

  function handleFilterCategoryChange(val: CategoryT | null): void {
    if (!val || val.id !== categoryId) {
      setCategoryId(val?.id ?? null);
    }
  }

  function handleFollowingChange(val: FollowingRangeT): void {
    setFollowing(val);
    if (val) {
      localStorage.setItem("following_BoardListPage_default", val);
    } else {
      // edge case for all boards
      localStorage.setItem("following_BoardListPage_default", "_all_");
    }
  }

  function handleCreateBoardClick(): void {
    router.push("/boards/create");
  }


  return (
    <Container rtlP>
      <Row
        width='100%'
        display='flex'
        alignItems='center'
        sx={{
          width: "100%",
          overflowX: "auto",
          flexWrap: "nowrap",
          "&::-webkit-scrollbar": {
            display: "none",
            // height: '6px',
          },
        }}
      >
        <CategoryFilterSelector
          filterId={categoryId}
          onFilterChange={handleFilterCategoryChange}
        />
        <Expand />
        {me && (
          <Button
            size={downSm ? "small" : "medium"}
            startIcon={<AddIcon />}
            onClick={handleCreateBoardClick}
            sx={{
              minWidth: "120px",
              whiteSpace: "nowrap",
            }}
          >
            {t("createBoard")}
          </Button>
        )}
      </Row>

      <Gap y={1} />

      <Row
        width='100%'
        alignItems='center'
        sx={{
          overflowX: "scroll",
          overflowY: "visible",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {me && (
          <FollowingSelector
            value={following}
            onChange={handleFollowingChange}
            size={downSm ? "small" : "medium"}
          />
        )}

        {!downSm && <Expand />}

        <Row>
          <IconButton
            aria-label='reload-boards'
            size='small'
            onClick={handleErrorRetry}
          >
            <RetryIcon />
          </IconButton>

          <BoardSortChips
            sort={sort}
            size={downSm ? "small" : "medium"}
            onChange={handleSortChange}
          />
        </Row>
      </Row>

      <Gap y={2} />

      <BoardList
        listOpt={listOpt}
        regenCnt={regenCnt}
      />


      <Box
        position='fixed'
        right={18}
        bottom={20}
      >
        <ScrollTopButton size={downSm ? "small" : "medium"} />
      </Box>
    </Container>
  );
}
