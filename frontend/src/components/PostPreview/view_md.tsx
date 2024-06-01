import React from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Box, Divider, useTheme } from "@mui/material";
import { VideoPlayer2 } from "@/ui/tools/VideoPlayer2";
import { OverflowBox } from "@/ui/tools/OverflowBox";
import { HtmlParser } from "@/ui/tools/HtmlParser";
import { MarkdownParser } from "@/ui/tools/MarkdownParser";
import { BlurFilter } from "@/ui/tools/BlurFilter";
import { Tooltip } from "@/ui/tools/Tooltip";
import { Row, Gap, Expand } from "@/ui/layouts";
import { Txt, EllipsisTxt } from "@/ui/texts";
import { HoverableBox } from "@/ui/tools/HoverableBox";
import { PinIcon, ViewIcon, CommentOlIcon, BookmarkIcon, InfoOlIcon } from "@/ui/icons";
import { PostVoter } from "@/components/Voter";
import { Flag } from "@/components/Flag";
import { BoardNameItem } from "@/components/BoardNameItem";
import { BoardAuthorPreview } from "@/components/BoardAuthor";
import { AuthorFingerprint } from "@/components/AuthorFingerprint";
import { vizTime } from "@/utils/time";
import { shortenNumber } from "@/utils/formatter";
import { updatePostEv } from "@/system/global_events";
import { ManagingSection } from "@/components/ManagingSection";
import { PostMenuButton } from "@/components/PostMenuButton";
import { buildImgUrl } from "@/utils/media";
import { TransparentBox, ManagingStatusBox, SpoilerOrNsfw } from "./style";
import type { PostPreviewProps } from "./type";
import type { PostT } from "@/types";


export function PostPreviewMDView({
  post,
  manager,
  showBoard,
  size,
  fingerprintProps,
}: PostPreviewProps): JSX.Element {

  const t = useTranslations("components.PostPreview");
  const locale = useLocale();

  function handleUpdated(post: PostT): void {
    updatePostEv.emit(post);
  }

  // console.log('rendering post: ', post.title)

  const theme = useTheme();

  function renderMediumSizeBody(): JSX.Element {
    let maxHeight = "calc(min(260px, 45vw))";

    // 1. if videos exists
    if (post.videos?.length) {
      const video = post.videos![0];
      return (
        <Box
          maxHeight={maxHeight}
          width='100%'
        >
          <VideoPlayer2
            video={video}
            width='100%'
            height={maxHeight}
            autoPlay='onScroll'
          />
        </Box>
      );
    }

    // 2. if image exists
    if (post.images?.length) {
      const img0 = post.images[0];
      return (
        <Box
          position='relative'
          width='100%'
          height={maxHeight}
        >
          <Image
            src={buildImgUrl(null, img0.path)}
            alt='preview-img'
            fill
            style={{
              objectFit: "cover",
              overflow: "hidden",
            }}
          />
          {post.images.length > 1 && (
            <Txt
              variant='body2'
              fontWeight={700}
              position='absolute'
              color='#ffffff'
              bottom={2}
              right={6}
            >
              {t("plusImgs", { numMore: post.images.length - 1 })}
            </Txt>
          )}
        </Box>
      );
    }

    const bodyType = post.body_type;
    const body = post.body;
    // 3. if type == html
    if (bodyType === "html") {
      return (
        <OverflowBox
          maxHeight={maxHeight}
          hideColor={theme.palette.paper.main}
          sx={{ pointerEvents: "none" }}
        >
          <HtmlParser
            html={body ?? ""}
            fontSize='15px'
          />
        </OverflowBox>
      );
    }

    // 4. if markdown
    // set maxHeight for text/html samller
    maxHeight = "200px";
    if (bodyType === "md") {
      return (
        <OverflowBox
          maxHeight={maxHeight}
          hideColor={theme.palette.paper.main}
        >
          <MarkdownParser text={body ?? ""} />
        </OverflowBox>
      );
    }
    return <div />;
  }

  const statusIcons: { key: string; Icon: any; num: number }[] = [
    { key: "view", Icon: ViewIcon, num: post.num_check ?? 0 },
    { key: "comment", Icon: CommentOlIcon, num: post.num_comment ?? 0 },
  ];

  return (
    <HoverableBox
      bgcolor='paper.main'
      width='100%'
    >
      <ManagingStatusBox
        isManaging={Boolean(manager)}
        post={post}
        display='flex'
        width='100%'
      >
        <Row width='100%'>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='flex-start'
            alignItems='center'
            bgcolor='rgba(160, 160, 160, 0.15)'
            width={"34px"}
            height='100%'
          >
            <PostVoter
              post={post}
              onUpdated={handleUpdated}
              size={size}
            />
          </Box>

          <Box
            flex={1}
            display='flex'
            flexDirection='column'
            width='100%'
            overflow='hidden'
            py={1}
            px={2}
          >
            {post.pin && (
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
                      avatarSize='18px'
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
                    renderInfo={
                      fingerprintProps ? (): JSX.Element => <AuthorFingerprint {...fingerprintProps} /> : undefined
                    }
                  />
                )}
              </Box>
              {/* <Txt color='vague.light' variant='body2'>{AuthorUtils.getNickname(post.author)}·{vizTime(post.published_at, 'relative')}</Txt> */}

              {(post.flags ?? []).map((flag) => {
                return (
                  <Flag
                    key={flag.id}
                    flag={flag}
                    size='small'
                  />
                );
              })}
              {Boolean(post.bookmark) && (
                <Tooltip title={t("bookmark")}>
                  <BookmarkIcon
                    sx={{
                      fontSize: size == "small" ? 18 : 22,
                      color: "yellow.main",
                    }}
                  />
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
              <Box width='100%'>
                <Row>
                  <EllipsisTxt
                    variant='subtitle2'
                    fontSize='17px'
                    fontWeight={700}
                    maxLines={1}
                  >
                    {post.title}
                  </EllipsisTxt>
                </Row>

                <SpoilerOrNsfw post={post} />

                <Box width='100%'>
                  <BlurFilter hide={post.is_nsfw == true || post.is_spoiler == true}>
                    {renderMediumSizeBody()}
                  </BlurFilter>
                </Box>
              </Box>

              {/* status line */}
              <Box mt={0.5} />
              <Row>
                <Txt
                  color='vague.main'
                  variant='body2'
                  fontWeight={500}
                >
                  {vizTime(post.published_at, { type: "relative", locale })}
                </Txt>
                <Expand />
                <Row gap={0.75}>
                  {statusIcons.map(({ key, Icon, num }) => {
                    return (
                      <Row
                        key={key}
                        gap={0.25}
                      >
                        <Icon
                          fontSize='small'
                          sx={{ color: "vague.main" }}
                        />
                        <Txt color='vague.main'>{shortenNumber(num, { locale })}</Txt>
                      </Row>
                    );
                  })}
                </Row>
              </Row>
            </TransparentBox>

            {manager?.manage_censor ? (
              <Box
                width='100%'
                onClick={(e): void => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Divider sx={{ my: 0.5 }} />
                <ManagingSection
                  type='post'
                  item={post}
                  onUpdated={handleUpdated as any}
                />
              </Box>
            ) : (
              <>
                { post.trashed_at && (
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
        </Row>
      </ManagingStatusBox>
    </HoverableBox>
  );
}
