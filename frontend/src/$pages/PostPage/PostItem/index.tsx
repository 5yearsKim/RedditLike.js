"use client";

import React, { useEffect, useRef, useState, Fragment, ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Box, Divider, IconButton } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { ArrowForwardIcon, InfoOlIcon, ReportIcon, BookmarkOlIcon, BookmarkIcon, ShareIcon } from "@/ui/icons";
import { PostVoter } from "@/components/Voter";
import { BoardNameItem } from "@/components/BoardNameItem";
import { BoardAuthor } from "@/components/BoardAuthor";
import { BoardAuthorInteraction } from "@/components/BoardAuthorInteraction";
import { PostMenuButton, type PostMenuButtonT } from "@/components/PostMenuButton";
import { ManagingSection } from "@/components/ManagingSection";
import { Flag } from "@/components/Flag";
import { AuthorFingerprint } from "@/components/AuthorFingerprint";
import { Row, Col, Expand, Gap } from "@/ui/layouts";
import { Txt, ClickableTxt } from "@/ui/texts";
import { VideoPlayer2 } from "@/ui/tools/VideoPlayer2";
import { Tooltip } from "@/ui/tools/Tooltip";
import { HtmlParser } from "@/ui/tools/HtmlParser";
import { MarkdownParser } from "@/ui/tools/MarkdownParser";
import { ImageModal } from "@/ui/tools/ImageModal";
import { BlurFilter } from "@/ui/tools/BlurFilter";
import { PostImage } from "@/ui/custom_nodes/PostImage";
import { vizTime } from "@/utils/time";
// logic
import { usePostDialog } from "@/hooks/dialogs/PostDialog";
import { useUrlState } from "@/hooks/UrlState";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
// import { managingState } from "@/stores/ManagingStore";
import { useMe } from "@/stores/UserStore";
import { useBoardMain$ } from "@/stores/BoardMainStore";
import { usePostMainActions } from "@/stores/PostMainStore";
import * as PostApi from "@/apis/posts";
import type { PostT } from "@/types";

type PostItemProps = {
  post: PostT;
  onUpdated: (post: PostT) => void;
};

export function PostItem({
  post,
  onUpdated,
}: PostItemProps): ReactNode {
  const t = useTranslations("pages.PostPage.PostItem");
  const locale = useLocale();

  const router = useRouter();
  const { closePostDialog } = usePostDialog();
  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { downSm } = useResponsive();

  const contentRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<PostMenuButtonT | null>(null);
  // const managing$ = useValue(managingState);
  const boardMain$ = useBoardMain$();
  const postMainAct = usePostMainActions();

  const me = useMe();

  const [isHide, setIsHide] = useState<boolean>(post.is_nsfw == true || post.is_spoiler == true);

  const [modalImgs, setModalImgs] = useState<string[]>([]);
  // const [imgModalIdx, setImgModalIdx] = useState<number | null>(null);
  const [imgModalIdx, setImgModalIdx] = useUrlState<number | null>({
    key: "imgModalIdx",
    query2val: (query) => {
      if (!query) return null;
      const idx = parseInt(query);
      return isNaN(idx) ? null : idx;
    },
    val2query: (val) => val?.toString() ?? null,
    backOn: (val) => val === null,
  });

  const imgModalOpen = imgModalIdx !== null;


  useEffect(() => {
    if (contentRef.current) {
      const imgs = Array.from(contentRef.current!.getElementsByTagName("img")).filter((img) => {
        const className = img.parentElement?.className;
        if (className?.startsWith("tweet-")) {
          // 임시방편 트위터 막기
          return false;
        }
        return true;
      });

      const imgUrls = imgs.map((img) => img.src);

      setModalImgs(imgUrls);

      Array.from(imgs).forEach((img, idx) => {
        img.onclick = function (): void {
          setImgModalIdx(idx);
        };
      });
    }
  }, [isHide]);

  function handleImgModalClose(): void {
    setImgModalIdx(null);
  }

  function handleBlurClick(): void {
    setIsHide(false);
  }

  function handleEditClick(): void {
    closePostDialog();
    postMainAct.reset();
    router.push(`/boards/${post.board_id}/update-post/${post.id}`);
  }

  async function handleDeleteClick(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("deletePost"),
      body: t("deletePostMsg"),
      useOk: true,
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await PostApi.remove(post.id);
      enqueueSnackbar(t("deletePostSuccess"), { variant: "success" });
      closePostDialog();
      router.push(`/boards/${post.board_id}?refresh=true`);
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("deletePostFailed"), { variant: "error" } );
    }
  }


  function renderBody(): JSX.Element {
    if (post.body_type == "html") {
      return (
        <HtmlParser html={post.body ?? ""} />
        // <RichEditor2Viewer
        //   value={post.body ?? ''}
        // />
      );
    } else if (post.body_type == "md") {
      return <MarkdownParser text={post.body ?? ""} />;
    } else {
      return <Txt>{post.body}</Txt>;
    }
  }

  function renderContent(): JSX.Element {
    function renderNumbers(): JSX.Element {
      return (
        <Row columnGap={1}>
          <Txt
            variant={downSm ? "body2" : "body2"}
            color='vague.light'
            fontWeight={500}
          >
            {t("viewN", { numCheck: post.num_check })}
          </Txt>
          <Txt
            variant={downSm ? "body2" : "body2"}
            color='vague.light'
            fontWeight={500}
          >
            {t("commentN", { numComment: post.num_comment })}
          </Txt>
        </Row>
      );
    }
    function renderVoter(): JSX.Element {
      return (
        <PostVoter
          isHorizontal
          post={post}
          onUpdated={onUpdated}
        />
      );
    }
    function renderActions(): JSX.Element {
      return (
        <Row>
          <Tooltip title={t("share")}>
            <IconButton
              aria-label='share-button'
              size='small'
              onClick={(e): void => menuButtonRef.current?.clickShare(e)}
            >
              <ShareIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("bookmark")}>
            <IconButton
              aria-label='bookmark-button'
              size='small'
              onClick={(e): void => menuButtonRef.current?.clickBookmark(e)}
            >
              {Boolean(post.bookmark) ? <BookmarkIcon sx={{ color: "yellow.main" }} /> : <BookmarkOlIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={t("report")}>
            <IconButton
              aria-label='report-button'
              size='small'
              onClick={(e): void => menuButtonRef.current?.clickReport(e)}
            >
              <ReportIcon />
            </IconButton>
          </Tooltip>
        </Row>
      );
    }

    if (post.deleted_at) {
      return (
        <Tooltip title={vizTime(post.deleted_at, { type: "absolute", locale })}>
          <div style={{ width: "fit-content", height: 100 }}>
            <Txt
              variant='body2'
              fontWeight={500}
              color='vague.light'
            >
              ({t("deletedByAuthor")})
            </Txt>
          </div>
        </Tooltip>
      );
    }
    if (post.trashed_at) {
      return (
        <Tooltip title={vizTime(post.trashed_at, { type: "absolute", locale })}>
          <div style={{ width: "fit-content", height: 100 }}>
            <Txt
              variant='body2'
              fontWeight={500}
              color='vague.light'
            >
              {post.trashed_by == "admin" ?
                `(${t("hiddenByAdmin")})` :
                `(${t("hiddenByBoardManager")})`
              }
            </Txt>
          </div>
        </Tooltip>
      );
    }
    return (
      <>
        <BlurFilter
          hide={isHide}
          onClick={handleBlurClick}
          message={
            <Txt
              color={post.is_nsfw ? "error.main" : post.is_spoiler ? "warning.main" : undefined}
              fontWeight={500}
            >
              <InfoOlIcon sx={{ verticalAlign: "middle", display: "inline-flex" }} />
              {post.is_nsfw
                ? t("alertNsfw")
                : post.is_spoiler
                  ? t("alertSpoiler")
                  : undefined}
            </Txt>
          }
        >
          <div ref={contentRef}>
            <Box minHeight='80px'>{renderBody()}</Box>

            {Boolean(post.images?.length) && (
              <Col
                alignItems='center'
                rowGap={2}
              >
                {post.images!.map((image) => {
                  return (
                    <Fragment key={image.id}>
                      <PostImage
                        path={image.path}
                        alt={image.path}
                        width={image.width ?? undefined}
                        height={image.height ?? undefined}
                      />
                    </Fragment>
                  );
                })}
              </Col>
            )}

            {Boolean(post.videos?.length) && (
              <VideoPlayer2
                video={post.videos![0]}
                width={"100%"}
                height={"50vh"}
                autoPlay='on'
              />
            )}
          </div>
        </BlurFilter>

        <Gap y={2} />

        {downSm ? (
          <Col mb={2}>
            <Row
              width='100%'
              justifyContent='space-between'
            >
              {renderActions()}
              {renderVoter()}
            </Row>
            <Gap y={2} />
            <Row justifyContent='flex-start'>{renderNumbers()}</Row>
          </Col>
        ) : (
          <Row mb={4}>
            {renderVoter()}
            <Gap x={3} />
            {renderActions()}
            <Gap x={3} />
            {renderNumbers()}
          </Row>
        )}
      </>
    );
  }

  return (
    <Fragment>
      {/* top line */}
      <Row>
        {downSm ? (
          <Row>
            {post.board && (
              <BoardNameItem
                board={post.board}
                avatarSize='26px'
                textVariant='body1'
              />
            )}
          </Row>
        ) : (
          <Row>
            <Txt
              variant='subtitle2'
              color='primary'
            >
              {t("board")}
            </Txt>

            <ArrowForwardIcon
              color='primary'
              sx={{ ml: 1, mr: 1, width: "14px", height: "14px" }}
            />

            {post.board ? (
              <BoardNameItem
                board={post.board}
                avatarSize='26px'
                textVariant='body1'
              />
            ) : (
              <Box height='40px' />
            )}
          </Row>
        )}

        <Expand />
        <PostMenuButton
          ref={menuButtonRef}
          post={post}
          manager={boardMain$.data?.manager ?? null}
          onUpdated={onUpdated}
        />
      </Row>

      <Gap y={2} />

      <Row>
        <Txt
          variant='h5'
          sx={{ wordBreak: "break-all" }}
        >
          {post.title}
        </Txt>

        <Expand />

        {(post.flags ?? []).map((flag) => {
          return (
            <Flag
              key={flag.id}
              flag={flag}
              size={downSm ? "small" : "medium"}
            />
          );
        })}
      </Row>

      <Gap y={1} />

      <Row>
        <BoardAuthorInteraction
          meManager={boardMain$.data?.manager ?? null}
          author={post.author ?? null}
        >
          <BoardAuthor
            author={post.author ?? null}
            renderInfo={(): JSX.Element => {
              return (
                <AuthorFingerprint
                  isMe={Boolean(me) && me?.id == post.author?.id}
                  isManager={post.show_manager && post.author?.is_manager}
                />
              );
            }}
          />
        </BoardAuthorInteraction>
      </Row>

      <Gap y={1} />

      <Row>
        <Txt
          color='vague.light'
          variant='body2'
          fontWeight={500}
        >
          {vizTime(post.published_at, { type: "absolute", locale })}
        </Txt>

        {Boolean(post.rewrite_at) && (
          <Tooltip title={vizTime(post.rewrite_at, { type: "absolute", locale })}>
            <div>
              <Txt
                color='vague.light'
                variant='body2'
                fontWeight={500}
              >
                ({t("edited")})
              </Txt>
            </div>
          </Tooltip>
        )}

        <Expand />

        {me?.id == post.author_id && !post.deleted_at && (
          <>
            <ClickableTxt
              color='vague.light'
              variant='body2'
              fontWeight={500}
              onClick={handleEditClick}
            >
              {t("edit")}
            </ClickableTxt>

            <Gap x={1} />

            <ClickableTxt
              color='vague.light'
              variant='body2'
              fontWeight={500}
              onClick={handleDeleteClick}
            >
              {t("delete")}
            </ClickableTxt>
          </>
        )}
      </Row>

      <Divider sx={{ mt: 1, mb: 1 }} />

      {/* content */}
      {renderContent()}

      {boardMain$.data?.manager?.manage_censor && (
        <Box
          width='100%'
          margin='auto'
          mt={2}
        >
          <ManagingSection
            type='post'
            item={post}
            onUpdated={onUpdated as any}
          />
        </Box>
      )}

      <ImageModal
        open={imgModalOpen}
        initialIdx={imgModalIdx ?? undefined}
        onClose={handleImgModalClose}
        images={modalImgs}
      />
    </Fragment>
  );
}
