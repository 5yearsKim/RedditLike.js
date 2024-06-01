import React, { ReactNode } from "react";
import { useLocale } from "next-intl";
import { Row, Col, Box, Expand } from "@/ui/layouts";
import { Txt, EllipsisTxt } from "@/ui/texts";
import { CommentOlIcon, ViewIcon, VoteOlIcon } from "@/ui/icons";
import { shortenNumber } from "@/utils/formatter";
import { vizTime } from "@/utils/time";
import { BlurFilter } from "@/ui/tools/BlurFilter";
import { PostSmallSizeThumbnail } from "../PostPreview/style";
import type { PostT } from "@/types";

export const PostMiniPreview = React.memo(_PostMiniPreview);

type PostMiniPreviewProps = {
  post: PostT;
};

function _PostMiniPreview({
  post,
}: PostMiniPreviewProps): ReactNode {

  const locale = useLocale();

  const statusIcons: { key: string; Icon: any; num: number }[] = [
    { key: "vote", Icon: VoteOlIcon, num: post.score ?? 0 },
    { key: "view", Icon: ViewIcon, num: post.num_check ?? 0 },
    { key: "comment", Icon: CommentOlIcon, num: post.num_comment ?? 0 },
  ];

  const thumbnail = (
    <PostSmallSizeThumbnail
      post={post}
      height={40}
      width={50}
      boxProps={{ mr: 1 }}
    />
  );

  return (
    <Row position='relative'>
      {thumbnail && (
        <>
          <BlurFilter
            hide={post.is_nsfw == true || post.is_spoiler == true}
            radius='2px'
          >
            {thumbnail}
          </BlurFilter>
        </>
      )}
      <Col flex={1}>
        <Row>
          <EllipsisTxt
            maxLines={2}
            variant='body2'
            fontWeight={500}
          >
            {post.title}
          </EllipsisTxt>

          {/* <CommentOlIcon sx={{ width: 16, height: 16, color: 'vague.light' }}/>
          <Box mr={0.5}/>
          <Txt variant='body2' color='vague.light'>{shortenNumber(post.num_comment)}</Txt>
          */}
        </Row>
        <Row>
          <Txt
            variant='body3'
            color='vague.main'
            sx={{ whiteSpace: "nowrap" }}
          >
            {vizTime(post.published_at, { type: "relative" , locale, noSuffix: true })}
          </Txt>

          <Expand />

          {statusIcons.map(({ key, Icon, num }) => {
            const iconSize = "14px";
            return (
              <Row
                key={key}
                ml={1}
              >
                <Icon
                  sx={{
                    color: "vague.light",
                    width: iconSize,
                    height: iconSize,
                  }}
                />
                <Box mr={0.5} />
                <Txt variant='body3' color='vague.light'>{shortenNumber(num, { locale })}</Txt>
              </Row>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
}
