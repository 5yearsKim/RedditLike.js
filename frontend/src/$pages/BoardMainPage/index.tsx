"use client";
import React, { Fragment, useState, ReactNode, useEffect, SyntheticEvent } from "react";
import { useTranslations } from "next-intl";
import { Container, Box, Gap, Row, Col, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardThemeProvider } from "@/ui/tools/BoardThemeProvider";
import { Tabs, Tab, Button, IconButton, Hidden } from "@mui/material";
import { ScrollTopButton } from "@/ui/tools/ScrollTopButton";
import { PostOlIcon, InfoOlIcon, RetryIcon, LiveChatIcon, AddIcon } from "@/ui/icons";
import { Avatar } from "@/ui/tools/Avatar";
import { buildImgUrl } from "@/utils/media";

import { useResponsive } from "@/hooks/Responsive";
import { MainWithPannels } from "@/components/MainWithPannels";
import { PostSortChips } from "@/components/PostSortChips";
import { BoardMenuButton } from "@/components/BoardMenuButton";

import { SideBox } from "./styles";
import { AuthorPreview, AuthorPreviewMb } from "./AuthorPreview";
import { FlagSelector } from "./FlagSelector";
import { AboutBoard } from "./AboutBoard";
import { PinnedPost } from "./PinnedPost";
import { BoardFollowButton } from "./BoardFollowButton";
import { BoardPostList } from "./BoardPostList";
import { LiveChatPreview } from "./LiveChatPreview";
import { RuleSummary } from "./RuleSummary";
import { MuterNotifyBox } from "./MuterNotifyBox";

//logic
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { atom, useRecoilState } from "recoil";
import { useLoginAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { initFromStorage } from "@/utils/recoil";
import { useMe, useMeMuter } from "@/stores/UserStore";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import { useSearchActions } from "@/stores/SearchStore";
import { useRecentBoardsActions } from "@/stores/RecentBoardsStore";
import * as ChatRoomApi from "@/apis/chat_rooms";
import type {
  BoardManagerT, AuthorT, FlagT, PostSortT, BoardT, BoardRuleT, ChatRoomT,
} from "@/types";

export type BoardMainPageSsrProps = {
  board: BoardT;
  author: AuthorT | null;
  manager: BoardManagerT | null;
  flags: FlagT[];
  rules: BoardRuleT[];
};


type BoardTabT = "post" | "info" | "chat";

// local recoil states
const sortState = atom<PostSortT>({
  key: "sort_BoardMainPage",
  default: "hot",
  effects: [
    initFromStorage<PostSortT>("sort_BoardMainPage_default", (val) => {
      if (val == "hot" || val == "recent") {
        return val;
      }
      return "hot";
    }),
  ],
});

const fromAtState = atom<undefined | Date>({
  key: "fromAt_BoardMainPage",
  default: undefined,
});


export function BoardMainPage({
  board,
  flags,
  author,
  manager,
  rules,
}: BoardMainPageSsrProps): ReactNode {
  const t = useTranslations("pages.BoardMainPage");
  const { downSm } = useResponsive();
  const router = useRouter();
  const { showLoginAlertDialog } = useLoginAlertDialog();


  const [sort, setSort] = useRecoilState(sortState);
  const [fromAt, setFromAt] = useRecoilState(fromAtState);


  const [flagFilter, setFlagFilter] = useState<FlagT | null>(null);
  const [tab, setTab] = useState<BoardTabT>("post");
  const [regenCnt, setRegenCnt] = useState<number>(0);

  const me = useMe();
  const muter = useMeMuter();
  const boardMain$ = useBoardMain$();
  const boardMainAct = useBoardMainActions();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchQ = searchParams.get("q");
  const searchAct = useSearchActions();
  const recentBoardsAct = useRecentBoardsActions();

  const [chatRoom, setChatRoom] = useState<ChatRoomT|null>(null);

  const isManager = Boolean(manager);

  // set ssr value to board store
  useEffect(() => {
    boardMainAct.set({
      status: "loaded",
      data: {
        board,
        manager,
        author,
        flags,
        rules,
      },
      lastUpdated: new Date(),
    });
  }, [board.id]);

  /**
   * sort?: 'recent'
   * refresh?: 'true'
   */
  useEffect(() => {
    const _sort = searchParams.get("sort");
    if (_sort == "recent") {
      setSort("recent");
    }
    const _refresh = searchParams.get("refresh");
    if (_refresh == "true") {
      setRegenCnt(regenCnt + 1);
    }
  }, []);

  // recent board log
  useEffect(() => {
    recentBoardsAct.push(board);
  }, [board.id]);

  // on user change
  useEffect(() => {
    if (boardMain$.status == "loaded" && me?.id !== boardMain$.data?.author?.id) {
      boardMainAct.load({ id: board.id });
    }
  }, [me?.id]);

  // set navbar search board
  useEffect(() => {
    searchAct.patch({ searchBoard: board });
    return (): void => {
      searchAct.patch({ searchBoard: undefined });
    };
  }, [board.id]);

  // load chatRoom
  useEffect(() => {
    const _loadChat = async (): Promise<void> => {
      try {
        const { data: fetched } = await ChatRoomApi.list({
          public: "only",
          boardId: board.id,
          $board: true,
        });
        if (fetched.length > 0) {
          setChatRoom(fetched[0]);
        } else {
          setChatRoom(null);
        }
      } catch (e) {
        console.warn(e);
      }
    };
    if (boardMain$.status != "loaded") {
      setChatRoom(null);
      return;
    }
    // status == 'loaded'
    if (chatRoom && chatRoom.board_id === board.id) {
      // already loaded -> pass
      // do nothing
    } else if (!board.use_public_chat) {
      // info: no public chat -> null
      setChatRoom(null);
    } else {
      _loadChat();
    }
  }, [boardMain$.status, board.id]);


  function handleSortChange(newSort: PostSortT): void {
    setSort(newSort);
  }

  function handleFromAtChange(val: Date | undefined): void {
    setFromAt(val);
  }

  function handleRegenClick(): void {
    setRegenCnt(regenCnt + 1);
  }

  function handleTabChange(event: SyntheticEvent, newValue: string): void {
    setTab(newValue as BoardTabT);
  }

  function handleFlagSelect(flag: FlagT | null): void {
    setFlagFilter(flag);
  }

  function handleSearchCacel(): void {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("q");
    current.delete("authorId");

    router.push(`${pathname}?${current.toString()}`);
  }

  function handleBoardUpdated(newBoard: BoardT): void {
    boardMainAct.set(($) => ({ ...$, data: { ...$.data!, board: newBoard } }));
  }

  function handleFakeCreateClick(): void {
    showLoginAlertDialog();
  }


  // board muter 이거나 manager only 인데 manager 아니거나 group muter 이거나
  const createPostDisabled =
    Boolean(board.muter) ||
    (board.allow_post_manager_only && manager?.manage_write !== true) ||
    Boolean(muter);

  const validBoard = boardMain$.status === "loaded" ? boardMain$.data!.board : board;

  function renderSearchNotifier(): JSX.Element {
    if (searchQ) {
      return (
        <Box mt={3}>
          <Row
            width='100%'
            justifyContent='space-between'
          >
            <Txt
              variant='subtitle1'
              fontWeight={400}
            >
              <Txt
                display='inline'
                variant='subtitle1'
                fontWeight={700}
              >{`"${searchQ}" `}</Txt>
              {t("searchResult")}
            </Txt>
            <Button
              variant='outlined'
              onClick={handleSearchCacel}
            >
              {t("toBoardHome")}
            </Button>
          </Row>
        </Box>
      );
    }
    return <></>;
  }

  function renderMain(): JSX.Element {
    return (
      <>
        {/* if desktop */}
        <Hidden
          smDown
          implementation='css'
        >
          {!downSm && (
            <>
              <Row>
                {flags.length > 0 && (
                  <Box mr={1}>
                    <FlagSelector
                      boardId={board.id}
                      flags={flags}
                      selected={flagFilter}
                      onSelect={handleFlagSelect}
                    />
                  </Box>
                )}

                <PostSortChips
                  sort={sort}
                  onChange={handleSortChange}
                  onFromAtChange={handleFromAtChange}
                />
                <IconButton
                  aria-label='reload-posts'
                  size='small'
                  onClick={handleRegenClick}
                >
                  <RetryIcon />
                </IconButton>

                <Expand />
                {/* {isManager && <ManagingSwitch boardId={board.id} />} */}
                {!me && (
                  <Button
                    startIcon={<AddIcon fontSize='small' />}
                    variant='contained'
                    size='medium'
                    onClick={handleFakeCreateClick}
                    sx={{ borderRadius: 8 }}
                  >
                    {t("post")}
                  </Button>
                )}
              </Row>

              <Gap y={2} />

              <MainWithPannels
                main={
                  <Col>
                    <PinnedPost boardId={board.id} />
                    <BoardPostList
                      sort={sort}
                      fromAt={fromAt}
                      manager={manager}
                      boardId={board.id}
                      regenCnt={regenCnt}
                      search={searchQ}
                      flagFilter={flagFilter}
                    />
                  </Col>
                }
                gap={1}
                pannels={[
                  ...(Boolean(board.muter)
                    ? [
                      <MuterNotifyBox
                        key='board-notify-box'
                        muter={board.muter!}
                      />,
                    ]
                    : []),
                  <Fragment key='author-preview'>
                    <AuthorPreview
                      boardId={board.id}
                      createPostDisabled={createPostDisabled}
                    />
                  </Fragment>,
                  <Fragment key='board-info'>
                    <SideBox
                      title={t("boardInfo")}
                      actions={[
                        <BoardMenuButton
                          key='board-menu-button'
                          board={validBoard}
                          color='contrast'
                          onUpdated={handleBoardUpdated}
                        />,
                      ]}
                    >
                      <Box p={1}>
                        <AboutBoard
                          board={board}
                          isManager={isManager}
                        />
                      </Box>
                    </SideBox>
                  </Fragment>,
                  <Fragment key='public-chat'>
                    {Boolean(chatRoom) && (
                      <SideBox title={t("liveChat")}>
                        <Box maxWidth='min(33vw, 300px)'>
                          <LiveChatPreview
                            chatRoom={chatRoom!}
                            messageSize='small'
                            author={boardMain$.data?.author}
                            maxHeight={"300px"}
                          />
                        </Box>
                      </SideBox>
                    )}
                  </Fragment>,
                  // <Fragment key='board-link'>
                  //   {boardLinks$.status == "loaded" && boardLinks$.data.length > 0 && (
                  //     <SideBox title='외부 링크'>
                  //       <Box p={1}>
                  //         <BoardLinkList links={boardLinks$.data} />
                  //       </Box>
                  //     </SideBox>
                  //   )}
                  // </Fragment>,
                  <Fragment key='board-misc'>
                    {boardMain$.status == "loaded" && boardMain$.data!.rules.length > 0 && (
                      <SideBox title={t("boardRule")}>
                        <RuleSummary rules={boardMain$.data!.rules} />
                      </SideBox>
                    )}
                    {/* {boardRelations$.status == "loaded" && boardRelations$.data.length > 0 && (
                      <SideBox title='연관 게시판'>
                        <BoardRelationList relations={boardRelations$.data} />
                      </SideBox>
                    )} */}
                  </Fragment>,
                ]}
              />
              <Box
                position='fixed'
                right={32}
                bottom={16}
              >
                <ScrollTopButton />
              </Box>
            </>
          )}
        </Hidden>

        {/* if mobile */}
        <Hidden
          smUp
          implementation='css'
        >
          {downSm && (
            <Col>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant='fullWidth'
              >
                <Tab
                  label={
                    <Row>
                      <PostOlIcon />
                      <Gap x={1} />
                      {t("post")}
                    </Row>
                  }
                  value='post'
                />
                <Tab
                  label={
                    <Row sx={{ whiteSpace: "nowrap" }}>
                      <InfoOlIcon />
                      <Gap x={1} />
                      {t("boardInfoMb")}
                    </Row>
                  }
                  value='info'
                />
                {chatRoom && (
                  <Tab
                    label={
                      <Row sx={{ whiteSpace: "nowrap" }}>
                        <LiveChatIcon />
                        <Gap x={1} />
                        {t("liveChat")}
                      </Row>
                    }
                    value='chat'
                  />
                )}
              </Tabs>

              <Gap y={1} />

              {tab == "post" && (
                <>
                  <Box
                    display='flex'
                    justifyContent='flex-end'
                  >
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

                      {flags.length > 0 && (
                        <Box mr={0}>
                          <FlagSelector
                            boardId={board.id}
                            flags={flags}
                            selected={flagFilter}
                            onSelect={handleFlagSelect}
                          />
                        </Box>
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

                  <Box
                    display='flex'
                    flexDirection={createPostDisabled ? "row" : "column"}
                    justifyContent={createPostDisabled ? "space-between" : undefined}
                  >
                    <Gap y={1} />
                    <AuthorPreviewMb
                      boardId={board.id}
                      createPostDisabled={createPostDisabled}
                    />
                  </Box>

                  <Gap y={2} />

                  <PinnedPost boardId={board.id} />

                  <BoardPostList
                    sort={sort}
                    fromAt={fromAt}
                    manager={manager}
                    boardId={board.id}
                    regenCnt={regenCnt}
                    search={searchQ}
                    flagFilter={flagFilter}
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
              {tab == "info" && (
                <>
                  <Row justifyContent='space-between'>
                    <Txt variant='h6'>{t("boardInfo")}</Txt>

                    <BoardMenuButton
                      key='board-menu-button'
                      board={validBoard}
                      onUpdated={handleBoardUpdated}
                    />
                  </Row>

                  <Gap y={1} />

                  <AboutBoard
                    board={board}
                    isManager={isManager}
                  />

                  <Gap y={2} />

                  {Boolean(board.muter) && (
                    <>
                      <MuterNotifyBox
                        key='board-notify-box'
                        muter={board.muter!}
                      />
                      <Gap y={2} />
                    </>
                  )}

                  {/*

                  {boardLinks$.status == "loaded" && boardLinks$.data.length > 0 && (
                    <>
                      <Gap y={4} />

                      <Txt variant='h6'>외부 링크</Txt>

                      <Gap y={1} />
                      <BoardLinkList links={boardLinks$.data} />
                    </>
                  )}
                  */}

                  {boardMain$.status == "loaded" && boardMain$.data!.rules.length > 0 && (
                    <>
                      <Gap y={4} />

                      <Txt variant='h6'>{t("boardRule")}</Txt>

                      <Gap y={1} />

                      <RuleSummary rules={boardMain$.data!.rules} />
                    </>
                  )}

                  {/*
                  {boardRelations$.status == "loaded" && boardRelations$.data.length > 0 && (
                    <>
                      <Gap y={4} />

                      <Txt variant='h6'>연관 게시판</Txt>

                      <Gap y={1} />

                      <BoardRelationList relations={boardRelations$.data} />
                    </>
                  )} */}
                </>
              )}
              {tab == "chat" && Boolean(chatRoom) && (
                <LiveChatPreview
                  chatRoom={chatRoom!}
                  messageSize='medium'
                  author={boardMain$.data?.author}
                  maxHeight={"calc(100vh - 300px)"}
                  openOnInit
                />
              )}
              <Gap y={8} />
            </Col>
          )}
        </Hidden>
      </>
    );
  }

  return (
    <BoardThemeProvider board={board}>
      {/* board bg image */}
      <Box
        position='relative'
        width='100%'
        bgcolor='primary.main'
        height={board.bg_path ? "calc(50px + 8vh)" : "50px"}
        overflow='hidden'
      >
        {board.bg_path && (
          <img
            src={buildImgUrl(null, board.bg_path)}
            alt='bg-img'
            width='100%'
            height='100%'
            style={{ objectFit: "cover" }}
          />
        )}
      </Box>
      <Container>
        <Row position='relative'>
          <Gap x={2} />
          <Box
            width='auto'
            height='auto'
            borderRadius='50%'
            p='3px'
            bgcolor='paper.main'
            sx={{
              transform: "scale(1.5)",
            }}
          >
            <Avatar
              src={board.avatar_path ? buildImgUrl(null, board.avatar_path, { size: "xs" }) : undefined}
              letter={board.name.slice(0, 1)}
              rseed={board.id}
              size='40px'
            />
          </Box>

          <Gap x={3} />

          <Txt variant='h5'>{board.name}</Txt>

          <Gap x={2} />

          {me !== null && (
            <BoardFollowButton
              board={validBoard}
              size={downSm ? "small" : "medium"}
              minWidth={downSm ? 80 : 100}
            />
          )}

          <Expand />

          {board.trashed_at && (
            <Txt
              variant="body2"
              color='error.main'
            >
              {t("hiddenByAdmin")}
            </Txt>
          )}

          {/* {chatRoom &&
              <Hidden smDown implementation='css'>
                <LiveChatFab chatRoom={chatRoom} author={board$.author ?? null}  ref={liveChatRef}/>
              </Hidden>
            } */}
        </Row>

        {renderSearchNotifier()}

        <Box mt={{ xs: 1, sm: 4 }} />

        {renderMain()}
      </Container>
    </BoardThemeProvider>
  );
}