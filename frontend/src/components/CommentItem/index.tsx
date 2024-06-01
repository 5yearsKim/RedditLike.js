"use client";

import React, { Fragment } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Collapse, Button, IconButton } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { useTheme, alpha } from "@mui/material/styles";
import { UnfoldIcon, NestedIcon, ReplyIcon, InfoOlIcon } from "@/ui/icons";
import { Row, Box, Gap, Expand } from "@/ui/layouts";
import { Clickable } from "@/ui/tools/Clickable";
import { Tooltip } from "@/ui/tools/Tooltip";
import { HtmlParser } from "@/ui/tools/HtmlParser";
import { MarkdownParser } from "@/ui/tools/MarkdownParser";
import { ImageModal } from "@/ui/tools/ImageModal";
import { Txt } from "@/ui/texts";
import { CommentVoter } from "@/components/Voter";
import { BoardAuthor } from "@/components/BoardAuthor";
import { BoardAuthorInteraction } from "@/components/BoardAuthorInteraction";
import { ManagingSection } from "@/components/ManagingSection";
import { CommentInput } from "@/components/ComentInput";
import { AuthorFingerprint } from "@/components/AuthorFingerprint";
import { vizTime } from "@/utils/time";
import { CommentMenuButton } from "./CommentMenuButton";
import { CommentModifier } from "./CommentModifier";
import { FocusableBox } from "./style";
// logic
import { useState, useRef, useEffect, useMemo, MouseEvent } from "react";
import { useFocusComment } from "@/hooks/FocusComment";
import { useSnackbar } from "@/hooks/Snackbar";
import { useMe } from "@/stores/UserStore";
import { updateCommentEv } from "@/system/global_events";
import type { CommentT, PostT, BoardManagerT } from "@/types";


export const CommentItem = React.memo(_CommentItem, (p, n) => {
  return p.comment === n.comment && p.shrink === n.shrink;
});


type CommentItemProps = {
  comment: CommentT;
  post?: PostT|null
  manager?: BoardManagerT;
  shrink?: boolean;
  focusDisabled?: boolean;
  repliable?: boolean;
  childrenLoadFn: (commment: CommentT) => Promise<CommentT>
};

function _CommentItem({
  comment,
  post,
  manager,
  shrink,
  focusDisabled,
  repliable,
  childrenLoadFn,
}: CommentItemProps): JSX.Element {
  const t = useTranslations("components.CommentItem");
  const locale = useLocale();
  const ref = useRef<null | HTMLDivElement>(null);
  const bodyRef = useRef<null | HTMLDivElement>(null);
  const focusableRef = useRef<null | HTMLDivElement>(null);

  const { isCommentFocused, focusComment } = useFocusComment();
  const { enqueueSnackbar } = useSnackbar();

  const me = useMe();

  const [isHide, setIsHide] = useState<boolean>(false);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [showReply, setShowReply] = useState<boolean>(false);
  const [expandChildren, setExpandChildren] = useState<boolean>(false);

  const isFocused = focusDisabled !== true && isCommentFocused(comment.id);

  const [modalImgs, setModalImgs] = useState<string[]>([]);
  const [imgModalIdx, setImgModalIdx] = useState<number | null>(null);

  const imgModalOpen = imgModalIdx !== null;

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 20);
    }
  }, [isFocused]);

  useEffect(() => {
    if (bodyRef.current) {
      const imgs = Array.from(bodyRef.current!.getElementsByTagName("img")).filter((img) => {
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

  const cutoff = useMemo(() => {
    const threshold = 5;
    const children = comment.children ?? [];
    if (children.length > threshold) {
      return 2;
    }
    return undefined;
  }, [comment]);

  function handleUpdated(val: CommentT): void {
    updateCommentEv.emit(val);
  }

  function handleThreadLineClick(): void {
    setIsHide(true);
  }

  function handleExpandClick(): void {
    setIsHide(false);
  }

  function handleReplyClick(): void {
    setShowReply(!showReply);
  }

  function handleCancelReplyClick(): void {
    setShowReply(false);
  }

  function handleReplySubmitted(newComment: CommentT): void {
    setShowReply(false);
    const children = comment.children ?? [];
    children.splice(0, 0, newComment);
    const numChildren = comment.num_children ?? 0;

    handleUpdated({
      ...comment,
      num_children: numChildren + 1,
      children,
    });
    focusComment(newComment.id);
  }

  async function handleLoadReplyClick(e: MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    try {
      const newComment = await childrenLoadFn(comment);
      handleUpdated(newComment);
    } catch (e) {
      enqueueSnackbar(t("loadCommentFailed"), { variant: "error" });
    }
  }

  function handleExpandChildren(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setExpandChildren(true);
  }

  function handleImgModalClose(): void {
    setImgModalIdx(null);
  }

  function handleEditClick(): void {
    setIsEditingMode(true);
  }

  function handleEditCancel(): void {
    setIsEditingMode(false);
  }

  function handleEditModified(newComment: CommentT): void {
    setIsEditingMode(false);
    handleUpdated({ ...comment, ...newComment });
  }


  const theme = useTheme();
  const { downSm } = useResponsive();

  function renderChildren(): JSX.Element {
    let children = comment.children ?? [];
    let hiddenChildren: CommentT[] = [];
    if (shrink && cutoff) {
      hiddenChildren = children.slice(cutoff);
      children = children.slice(0, cutoff);
    }

    function renderHidden(): JSX.Element {
      if (!(shrink && cutoff)) {
        return <></>;
      }

      if (expandChildren) {
        return (
          <Fragment>
            {hiddenChildren.map((comm) => {
              return (
                <Fragment key={"comment_" + comm.id}>
                  <CommentItem
                    post={post}
                    comment={comm}
                    repliable={repliable}
                    manager={manager}
                    childrenLoadFn={childrenLoadFn}
                  />
                </Fragment>
              );
            })}
          </Fragment>
        );
      } else {
        const hiddenSum = hiddenChildren.reduce((sum, item) => sum + 1 + (item.num_children ?? 0), 0);
        return (
          <Button
            size='small'
            onClick={handleExpandChildren}
          >
            {t("plusComments", { numHidden: hiddenSum })}
          </Button>
        );
      }
    }

    return (
      <Box ml={{ xs: 0.4, sm: 0.6 }}>
        {children.map((comm) => {
          return (
            <Box
              width='100%'
              key={"comm_" + comm.id}
            >
              <CommentItem
                post={post}
                comment={comm}
                repliable={repliable}
                manager={manager}
                childrenLoadFn={childrenLoadFn}
              />
            </Box>
          );
        })}
        {renderHidden()}
      </Box>
    );
  }

  function renderBody(): JSX.Element {
    const { body_type, body } = comment;
    if (body_type == "html") {
      return (
        <HtmlParser
          html={body ?? ""}
          className='nuco-comment-specific'
        />
      );
    }
    if (body_type == "md") {
      return <MarkdownParser text={body ?? ""} />;
    }
    return <Txt>{body}</Txt>;
  }

  // under top line
  function renderContents(): JSX.Element {
    // if comment deleted
    if (comment.deleted_at) {
      return (
        <Box
          ml={1}
          mt={1}
          width='100%'
        >
          <Tooltip
            title={vizTime(comment.deleted_at, { type: "absolute", locale })}
            arrow
          >
            <div style={{ width: "fit-content" }}>
              <Txt
                variant='body2'
                fontWeight={500}
                color='vague.light'
              >
                ({t("deleted")})
              </Txt>
            </div>
          </Tooltip>
          {(comment.num_children ?? 0) > 0 && !comment.children?.length && (
            <Button
              size='small'
              onClick={handleLoadReplyClick}
              startIcon={<NestedIcon fontSize='small' />}
            >
              {t("numChildrenComment", { numChildren: comment.num_children })}
            </Button>
          )}
          {renderChildren()}
        </Box>
      );
    }

    // if editing mode
    if (isEditingMode) {
      return (
        <CommentModifier
          comment={comment}
          onCancel={handleEditCancel}
          onModified={handleEditModified}
        />
      );
    }
    return (
      <Box width='100%'>
        <Box
          ref={focusableRef}
          id='except-children'
          ml={1}
        >
          <Box
            ref={bodyRef}
            mt={0.5}
            width='100%'
          >
            {renderBody()}
          </Box>

          <Box mt={downSm ? 0 : 1} />

          {manager?.manage_censor ? (
            <Box width='100%'>
              <ManagingSection
                type='comment'
                item={comment}
                onUpdated={handleUpdated as any}
              />
            </Box>
          ) : (
            <>
              { comment.trashed_at && (
                <Row justifyContent='center'>
                  <InfoOlIcon sx={{ fontSize: 18, color: "error.main" }} />

                  <Gap x={1}/>

                  <Txt color='error.main'>{
                    comment.trashed_by == "admin" ? t("numChildrenComment")
                    : comment.trashed_by == "manager" ?
                      t("deletedByBoardManager")
                      : t("deleted")}
                  </Txt>
                </Row>
              )}
            </>
          )}

          {/* actions line */}
          <Row
            flexDirection={downSm ? "row-reverse" : "row"}
            mr={downSm ? 1 : 0}
          >
            <CommentVoter
              isHorizontal
              comment={comment}
              size={downSm ? "small" : "medium"}
              onUpdated={handleUpdated}
            />
            <Box mr={1.5} />
            {me && repliable && (
              <Tooltip title={t("reply")}>
                <IconButton
                  aria-label='reply-comment-button'
                  onClick={handleReplyClick}
                  size='small'
                  sx={{
                    color: showReply ? "primary.main" : "vague.light",
                  }}
                >
                  <ReplyIcon sx={{ fontSize: downSm ? "22px" : "26px" }} />
                </IconButton>
              </Tooltip>
            )}
            {downSm && (
              <>
                <Expand />
                {(comment.num_children ?? 0) > 0 && !comment.children?.length && (
                  <Button
                    size='small'
                    onClick={handleLoadReplyClick}
                    startIcon={<NestedIcon fontSize='small' />}
                  >
                    {t("numChildrenComment", { numChildren: comment.num_children })}
                  </Button>
                )}
              </>
            )}
          </Row>

          {showReply && me && (
            <CommentInput
              me={me}
              parent={comment}
              postId={comment.post_id}
              onCancel={handleCancelReplyClick}
              onSubmitted={handleReplySubmitted}
            />
          )}

          {!downSm && (comment.num_children ?? 0) > 0 && !comment.children?.length && (
            <Button
              size='small'
              onClick={handleLoadReplyClick}
              startIcon={<NestedIcon fontSize='small' />}
            >
              {t("numChildrenComment", { numChildren: comment.num_children })}
            </Button>
          )}
        </Box>
        {renderChildren()}
      </Box>
    );
  }

  return (
    <Box
      key={"comment_" + comment.id}
      ref={ref}
      mb={1}
      ml={0.5}
      mr={0}
      position='relative'
      // width='200px'
      borderRadius={1}
      border={
        manager?.manage_censor
          ?
          comment.trashed_at
            ? `1px solid ${theme.palette.error.main}`
            : comment.approved_at
              ? `1px sold ${theme.palette.success.main}`
              : undefined
          : undefined
      }
    >
      <FocusableBox
        position='absolute'
        focused={isFocused}
        width='calc(100% + 8px)'
        left={-6}
        height={focusableRef?.current?.clientHeight ? focusableRef.current.clientHeight + (downSm ? 45 : 50) : 0}
        zIndex={1}
        borderRadius={1}
        sx={{
          pointerEvents: "none",
        }}
      />
      {/* first row  */}
      <Row
        alignItems='center'
        width='100%'
      >
        <Row
          flex={1}
          pb={0.25} // to show flair shadow naturally
          sx={{
            overflowX: "scroll",
            transform: "translateX(-8px)",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Collapse
            in={isHide}
            orientation='horizontal'
          >
            <Clickable
              borderRadius={1}
              onClick={handleExpandClick}
            >
              <UnfoldIcon color='primary' />
            </Clickable>
          </Collapse>

          {/* <Box sx={{transform: 'scale(0.9)' }}> */}
          <BoardAuthorInteraction
            meManager={manager ?? null}
            author={comment.author ?? null}
          >
            <BoardAuthor
              author={comment.author ?? null}
              renderInfo={(): JSX.Element => {
                return (
                  <Row alignItems='center'>
                    <AuthorFingerprint
                      isMe={Boolean(me) && me?.id == comment.author?.id}
                      isAuthor={Boolean(post?.author?.id) && post!.author!.id == comment.author?.id}
                      authorIdx={comment.author_idx}
                      isManager={comment.show_manager && comment.author?.is_manager}
                    />

                    {/* createdAt */}
                    <Row>
                      <Box mx={0.5}>
                        <Txt color='vague.light'>·</Txt>
                      </Box>

                      <Tooltip title={vizTime(comment.created_at, { type: "absolute", locale })}>
                        <Box sx={{ cursor: "pointer" }}>
                          <Txt
                            variant='body2'
                            fontWeight={400}
                            color='vague.light'
                            whiteSpace='nowrap'
                          >
                            {vizTime(comment.created_at, { type: "relative", locale })}
                          </Txt>
                        </Box>
                      </Tooltip>
                      {/* rewriteAt */}
                      {Boolean(comment.rewrite_at) && (
                        <Tooltip title={vizTime(comment.rewrite_at, { type: "absolute", locale })}>
                          <div>
                            <Txt
                              mx={0.25}
                              color='vague.light'
                              variant='body2'
                              fontWeight={400}
                              whiteSpace='pre'
                            >
                              ({t("edited")})
                            </Txt>
                          </div>
                        </Tooltip>
                      )}
                    </Row>
                  </Row>
                );
              }}
            />
          </BoardAuthorInteraction>
        </Row>

        <Box alignSelf='flex-start'>
          <CommentMenuButton
            post={post ?? null}
            manager={manager ?? null}
            comment={comment}
            isEditingMode={isEditingMode}
            onUpdated={handleUpdated}
            onEditClick={handleEditClick}
          />
        </Box>
      </Row>
      {/* collapsible contents */}
      <Collapse in={!isHide}>
        <Row>
          {/* thread line box */}
          <Box
            pl={0.5}
            pr={0.5}
            onClick={handleThreadLineClick}
            alignSelf='stretch'
            sx={{
              cursor: "pointer",
              div: {
                backgroundColor: alpha(theme.palette.vague.main, 0.3),
                height: "100%",
                width: "2px",
              },
              "&:hover div": {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <div />
          </Box>

          {renderContents()}
        </Row>
      </Collapse>
      <ImageModal
        open={imgModalOpen}
        initialIdx={imgModalIdx ?? undefined}
        onClose={handleImgModalClose}
        images={modalImgs}
      />
    </Box>
  );
}
