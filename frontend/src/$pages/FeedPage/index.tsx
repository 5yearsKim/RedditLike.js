"use client";
import React, { Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Box, IconButton, Hidden } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { PostSortChips } from "@/components/PostSortChips";
import { Container, Row, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { RecentIcon, HotIcon, RetryIcon } from "@/ui/icons";
import { ScrollTopButton } from "@/ui/tools/ScrollTopButton";
import { FollowingSelector } from "@/components/FollowingSelector";
import { FeedList } from "./FeedList";
import { RecentPostList } from "./RecentPostList";
import { HotPostList } from "./HotPostList";
import { BoardSidebar } from "./BoardSidebar";
import { CreatePostSelector } from "./CreatePostSelector";
import { SideBox } from "./style";
// logic
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { atom, useRecoilState } from "recoil";
import { FollowingRangeT } from "@/components/FollowingSelector";
import { initFromStorage } from "@/utils/recoil";
import { useMe, useMeMuter } from "@/stores/UserStore";
import type { PostSortT } from "@/types";

const sortState = atom<PostSortT>({
  key: "sort_FeedPage",
  default: "hot",
  effects_UNSTABLE: [
    // ({ setSelf, trigger }): void => {
    //   if (trigger == 'get') {
    //     setSelf('discussed');
    //   }
    // },
    initFromStorage<PostSortT>("sort_FeedPage_default", (val) => {
      if (val == "recent" || val == "hot") {
        return val;
      }
      return "hot";
    }),
  ],
});

const fromAtState = atom<Date | undefined>({
  key: "fromAt_FeedPage",
  default: undefined,
});

const followingState = atom<FollowingRangeT>({
  key: "following_FeedPage",
  default: undefined,
  effects: [
    initFromStorage<FollowingRangeT>("following_FeedPage_default", (val) => {
      if (val == "except" || val == "only") {
        return val;
      }
      if (val == "_all_") {
        return undefined;
      }
      return "only"; // default
    }),
  ],
});

export function FeedPage(): ReactNode {
  const t = useTranslations("pages.FeedPage");
  const me = useMe();
  const muter = useMeMuter();
  const [sort, setSort] = useRecoilState(sortState);
  const [fromAt, setFromAt] = useRecoilState(fromAtState);
  const [following, setFollowing] = useRecoilState(followingState);
  const [regenCnt, setRegenCnt] = useState<number>(0);

  const searchParams = useSearchParams();

  /**
   * query
   * refresh: boolean|string
   */
  const $refresh = searchParams.get("refresh");
  useEffect(() => {
    if ($refresh == "true") {
      setRegenCnt(regenCnt + 1);
    }
  }, [$refresh]);

  function handleSortChange(newSort: PostSortT): void {
    setSort(newSort);
  }

  function handleFromAtChange(val: Date | undefined): void {
    setFromAt(val);
  }

  function handleRegenClick(): void {
    setRegenCnt(regenCnt + 1);
  }

  function handleFeedRangeChange(val: FollowingRangeT): void {
    setFollowing(val);
    if (val) {
      localStorage.setItem("following_FeedPage_default", val);
    } else {
      // edge case for all boards
      localStorage.setItem("following_FeedPage_default", "_all_");
    }
  }

  const { downSm, upSm, downMd, upMd, downLg } = useResponsive();

  function renderTopBar(): JSX.Element {
    if (downSm) {
      return (
        <Box display='flex'>
          <Row
            pt={0.6}
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
                size='small'
                value={following}
                onChange={handleFeedRangeChange}
              />
            )}
            <IconButton
              aria-label='reload-posts'
              size='small'
              onClick={handleRegenClick}
            >
              <RetryIcon />
            </IconButton>
            <PostSortChips
              size='small'
              sort={sort}
              onChange={handleSortChange}
              onFromAtChange={handleFromAtChange}
            />
          </Row>
        </Box>
      );
    } else {
      return (
        <Row>
          {me && (
            <FollowingSelector
              value={following}
              onChange={handleFeedRangeChange}
            />
          )}
          <Expand />
          <IconButton
            aria-label='reload-posts'
            size='small'
            onClick={handleRegenClick}
          >
            <RetryIcon />
          </IconButton>
          <PostSortChips
            size='medium'
            sort={sort}
            onChange={handleSortChange}
            onFromAtChange={handleFromAtChange}
          />
        </Row>
      );
    }
  }

  return (
    <Container
      maxWidth='lg'
      rtlP
    >
      <>
        {/* if mobile*/}
        <Hidden
          smUp
          implementation='css'
        >
          {downSm && (
            <>
              {renderTopBar()}

              <Box mt={1.5} />

              {me && !muter && (
                <>
                  <CreatePostSelector me={me} />
                  <Box mt={1.5} />
                </>
              )}

              <FeedList
                sort={sort}
                fromAt={fromAt}
                regenCnt={regenCnt}
                following={following}
              />

              <Box
                position='fixed'
                right={18}
                bottom={20}
              >
                <ScrollTopButton size='medium' />
              </Box>
            </>
          )}
        </Hidden>

        {/* if desktop*/}
        <Hidden
          smDown
          implementation='css'
        >
          {upSm && (
            <Row
              alignItems='stretch'
              columnGap={4}
              width='100%'
            >
              {upMd && (
                <Box
                  maxWidth='240px'
                  width='100%'
                  position='sticky'
                  alignSelf='flex-start'
                  top='80px'
                >
                  <BoardSidebar />
                </Box>
              )}

              <Box
                key='main'
                flex={1}
              >
                <Box
                  position='relative'
                  maxWidth={downMd ? "calc(100vw - 250px)" : "min(calc(100vw - 500px), 550px)"}
                  margin='auto'
                >
                  {renderTopBar()}

                  <Gap y={2} />

                  {me && !muter && (
                    <>
                      <CreatePostSelector me={me} />
                      <Gap y={2} />
                    </>
                  )}

                  <FeedList
                    sort={sort}
                    fromAt={fromAt}
                    regenCnt={regenCnt}
                    following={following}
                  />
                </Box>

                <Box
                  position='fixed'
                  right={32}
                  bottom={16}
                >
                  <ScrollTopButton />
                </Box>
              </Box>

              <Box
                key='right-side'
                display='flex'
                flexDirection='column'
                maxWidth='260px'
                width='100%'
              >
                {downLg && ["vote", "discussed"].includes(sort) && <Box height='55px' />}

                <Fragment key='recent-post'>
                  <SideBox>
                    <Row
                      ml={1}
                      my={0.75}
                    >
                      <RecentIcon fontSize='small' />
                      <Box mr={0.5} />
                      <Txt
                        variant='subtitle2'
                        fontWeight={700}
                      >
                        {t("recentPosts")}
                      </Txt>
                    </Row>
                    <RecentPostList key='recentPostList' />
                  </SideBox>
                </Fragment>

                <Gap y={2} />

                <Box
                  key='hot-post'
                  alignSelf='flex-start'
                  position='sticky'
                  top='80px'
                  width='100%'
                >
                  <SideBox>
                    <Row
                      ml={1}
                      my={0.75}
                    >
                      <HotIcon
                        fontSize='small'
                        color='secondary'
                      />
                      <Box mr={0.5} />
                      <Txt
                        variant='subtitle2'
                        fontWeight={700}
                      >
                        {t("hotPosts")}
                      </Txt>
                    </Row>
                    <HotPostList />
                  </SideBox>
                </Box>
              </Box>
            </Row>
          )}
        </Hidden>
      </>
    </Container>
  );
}
