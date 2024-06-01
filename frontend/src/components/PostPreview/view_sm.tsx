import React, { useCallback, useMemo, ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
import { BoardNameItem } from "@/components/BoardNameItem";
import { BoardAuthorPreview } from "@/components/BoardAuthor";
import { AuthorFingerprint } from "@/components/AuthorFingerprint";
import { PostVoter } from "@/components/Voter";
import { PostMenuButton } from "@/components/PostMenuButton";
import { Flag } from "@/components/Flag";
import { ManagingSection } from "@/components/ManagingSection";
import { BlurFilter } from "@/ui/tools/BlurFilter";
import { Tooltip } from "@/ui/tools/Tooltip";
import { Box, Row, Expand, Gap } from "@/ui/layouts";
import { EllipsisTxt, Txt } from "@/ui/texts";
import { PinIcon, ViewIcon, CommentOlIcon, InfoOlIcon, BookmarkIcon } from "@/ui/icons";
import { extractText } from "@/utils/html";
import { vizTime } from "@/utils/time";
import { shortenNumber } from "@/utils/formatter";
import { updatePostEv } from "@/system/global_events";

import { TransparentBox, SpoilerOrNsfw, PostSmallSizeThumbnail } from "./style";
import type { PostPreviewProps } from "./type";
import type { PostT } from "@/types";

export function PostPreviewSMView({
  post,
  manager,
  showBoard,
  size,
  fingerprintProps,
}: PostPreviewProps): ReactNode {
  const t = useTranslations("components.PostPreview");
  const locale = useLocale();

  const bodyText: string = useMemo(() => {
    return extractText(post.body ?? "", post.body_type);
  }, []);

  function handleUpdated(post: PostT): void {
    updatePostEv.emit(post);
  }

  // view
  const renderSmallSizeThumbnail = useCallback((): JSX.Element => {
    const [width, height] = [85, 80];
    return (
      <PostSmallSizeThumbnail
        post={post}
        width={width}
        height={height}
        borderRadius={1}
      />
    );
  }, []);

  const statusIcons: { key: string; Icon: any; num: number }[] = [
    { key: "view", Icon: ViewIcon, num: post.num_check ?? 0 },
    { key: "comment", Icon: CommentOlIcon, num: post.num_comment ?? 0 },
  ];

  const showManagingSection = Boolean(manager?.manage_censor);

  return (
    // <ManagingStatusBox
    //   isManaging={Boolean(isManaging)}
    //   post={post}
    //   display='flex'
    //   flexDirection='column'
    //   width='100%'
    // >
    <Box
      mx={-2}
      px={2}
      py={1}
      pb={showManagingSection ? 0 : undefined}
      bgcolor='paper.main'
    >
      {Boolean(post.pin) && (
        <Row>
          <PinIcon
            color='primary'
            sx={{ fontSize: "16px" }}
          />
          <Gap x={1} />
          <Txt
            variant='body3'
            fontWeight={500}
          >
            {t("pinned")}
          </Txt>
        </Row>
      )}

      <Row
        width='100%'
        maxHeight='1.5rem'
      >
        <Box
          position='relative'
          display='flex'
          flex={1}
          flexDirection='row'
          sx={{
            overflowX: "scroll",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {/* TODO: default board avatar */}
          {post.board && showBoard ? (
            <Row>
              <BoardNameItem
                avatarSize='16px'
                board={post.board}
                textVariant='body3'
              />
              <BoardAuthorPreview
                author={post.author ?? null}
                textVariant='body3'
                renderInfo={
                  fingerprintProps ? (): JSX.Element => <AuthorFingerprint {...fingerprintProps} /> : undefined
                }
              />
            </Row>
          ) : (
            <BoardAuthorPreview
              author={post.author ?? null}
              textVariant='body3'
              showAvatar
              showFlair
              renderInfo={fingerprintProps ? (): JSX.Element => <AuthorFingerprint {...fingerprintProps} /> : undefined}
            />
          )}
        </Box>
        {/* <Txt color='vague.light' variant='body2'>{AuthorUtils.getNickname(post.author)}·{vizTime(post.published_at, 'relative')}</Txt> */}

        <Txt
          color='vague.light'
          variant='body3'
          fontWeight={500}
        >
          {vizTime(post.published_at, { type: "relative", locale })}
        </Txt>

        {Boolean(post.flags?.length) && (
          <>
            <Gap x={1} />
            {(post.flags ?? []).map((flag) => {
              return (
                <Flag
                  key={flag.id}
                  flag={flag}
                  size='small'
                />
              );
            })}
          </>
        )}

        {Boolean(post.bookmark) && (
          <Tooltip title={t("bookmark")}>
            <BookmarkIcon sx={{ fontSize: size == "small" ? 18 : 22, color: "yellow.main" }} />
          </Tooltip>
        )}
        <PostMenuButton
          post={post}
          manager={manager ?? null}
          onUpdated={handleUpdated}
        />
      </Row>

      <TransparentBox
        width='100%'
        checked={Boolean(post.check)}
      >
        <Row>
          <Expand>
            <Row>
              <EllipsisTxt
                variant='subtitle2'
                fontWeight={700}
                maxLines={1}
              >
                {post.title}
              </EllipsisTxt>
            </Row>

            <Box minHeight='2px'>
              <SpoilerOrNsfw post={post} />
            </Box>

            <Box
              width='100%'
              minHeight={15}
            >
              <BlurFilter
                radius='4px'
                hide={post.is_nsfw == true || post.is_spoiler == true}
              >
                {/* <EllipsisTxt minHeight='1rem' maxLines={2}>{bodyText}</EllipsisTxt> */}
                <Txt
                  variant='body2'
                  textOverflow='ellipsis'
                  whiteSpace='pre-wrap'
                  sx={{
                    wordBreak: "break-word",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {bodyText}
                </Txt>
              </BlurFilter>
            </Box>

            {/* status line */}
            <Box mt={0.5} />
            <Row alignItems='center'>
              <Box
                onClick={(e): void => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <PostVoter
                  post={post}
                  onUpdated={handleUpdated}
                  isHorizontal
                  size='small'
                />
              </Box>
              <Expand />
              <Row
                gap={1}
                mr={0.75}
              >
                {statusIcons.map(({ key, Icon, num }) => {
                  return (
                    <Row
                      key={key}
                      gap={0.5}
                    >
                      <Icon sx={{ fontSize: 18, color: "vague.main" }} />
                      <Txt color='vague.main'>{shortenNumber(num, { locale })}</Txt>
                    </Row>
                  );
                })}
              </Row>
            </Row>
          </Expand>

          <BlurFilter
            hide={post.is_nsfw == true || post.is_spoiler == true}
            radius='8px'
          >
            {renderSmallSizeThumbnail()}
          </BlurFilter>
        </Row>
      </TransparentBox>

      {showManagingSection ? (
        <Box
          width='100%'
          onClick={(e): void => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <ManagingSection
            type='post'
            item={post}
            onUpdated={handleUpdated as any}
          />
        </Box>
      ) : (
        <>
          { post.trashed_at && post.trashed_by == "admin" && (
            <Row justifyContent='center'>
              <InfoOlIcon sx={{ fontSize: 18, color: "error.main" }} />
              <Gap x={1}/>
              <Txt color='error.main'>{
                post.trashed_by == "admin" ? t("deletedByAdmin")
                : post.trashed_by == "manager" ?
                  t("deletedByBoardModerator")
                  : t("deleted")}
              </Txt>
            </Row>
          )}
        </>
      )}
    </Box>
  );
}
