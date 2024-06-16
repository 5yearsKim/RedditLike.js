import React from "react";
// import React, { MouseEvent } from 'react';
import { useTranslations } from "next-intl";
import Image from "next/image";
import { styled, useTheme } from "@mui/material/styles";
import { Box, BoxProps, Button } from "@mui/material";
import { SpoilerIcon, NsfwIcon } from "@/ui/icons";
import { PlayCircleOlIcon, YoutubeIcon, LinkIcon } from "@/ui/icons";
import { LinkPreviewThumbnail } from "@/ui/custom_nodes/LinkPreviewThumbnail";
import { buildImgUrl } from "@/utils/media";
import {
  retrieveHtmlImages, retrieveYoutubeThumbnail, retrieveLinkPreviewUrl,
  retrieveTweetId, retrievePollId,
} from "@/utils/html";
import type { PostT } from "@/types";
import { env } from "@/env";
import P from "path";

interface TransparentBoxProps extends BoxProps {
  checked: boolean;
}

export const TransparentBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "checked",
})<TransparentBoxProps>(({ checked }: { checked: boolean }) => {
  return {
    opacity: checked ? 0.5 : undefined,
  };
});

interface ManagingStatusBoxProps extends BoxProps {
  post: PostT;
  isManaging: boolean;
  children: JSX.Element | JSX.Element[];
}

export function ManagingStatusBox(props: ManagingStatusBoxProps): JSX.Element {
  const { post, isManaging, children, ...boxProps } = props;
  const theme = useTheme();

  if (!isManaging) {
    return <Box {...boxProps}>{children}</Box>;
  }
  if (post.approved_at) {
    return (
      <Box
        width='100%'
        border={`1px solid ${theme.palette.success.main}`}
        {...boxProps}
      >
        {children}
      </Box>
    );
  }
  if (post.trashed_at) {
    return (
      <Box
        width='100%'
        border={`1px solid ${theme.palette.error.main}`}
        {...boxProps}
      >
        {children}
      </Box>
    );
  }
  return <Box {...boxProps}>{children}</Box>;
}

type SpolilerOrNsfwProps = {
  post: PostT;
};
export function SpoilerOrNsfw({ post }: SpolilerOrNsfwProps): JSX.Element {
  const t = useTranslations("components.PostPreview");
  return (
    <>
      {post.is_spoiler ? (
        <Button
          startIcon={<SpoilerIcon fontSize='small' />}
          color='warning'
          variant='contained'
          size='small'
          disableFocusRipple
          disableRipple
          sx={{
            py: 0.25,
            borderRadius: 16,
          }}
        >
          {t("spoiler")}
        </Button>
      ) : post.is_nsfw ? (
        <Button
          startIcon={<NsfwIcon fontSize='small' />}
          color='error'
          variant='contained'
          size='small'
          disableFocusRipple
          disableRipple
          sx={{
            py: 0.25,
            borderRadius: 16,
          }}
        >
          {t("nsfw")}
        </Button>
      ) : (
        <></>
      )}
    </>
  );
}

type PostSmallSizeThumbnailProps = {
  post: PostT;
  width: number;
  height: number;
  borderRadius?: number;
  boxProps?: BoxProps;
};

export function PostSmallSizeThumbnail({
  post,
  width,
  height,
  borderRadius,
  boxProps,
}: PostSmallSizeThumbnailProps): JSX.Element | null {

  const imageWithNum = (url: string, num: number): JSX.Element => (
    <Box
      {...boxProps}
      position='relative'
      borderRadius={borderRadius}
      overflow='hidden'
      width={width}
      height={height}
    >
      <Image
        src={url}
        alt='preview-img'
        fill
        style={{
          objectFit: "cover",
        }}
      />
      {num > 1 && (
        <Box
          position='absolute'
          right={2}
          bottom={0}
          color='#fafafa'
          sx={{
            fontSize: 11,
            fontWeight: 500,
            background: "radial-gradient(rgba(0, 0, 0, 0.2) 20%, transparent)",
          }}
        >
          +{num - 1}장
        </Box>
      )}
    </Box>
  );

  if (post.thumb_path) {
    let numImgs = 0;
    if (post.body_type == "html") {
      numImgs = (post.body ?? "").match(/<(img|post-img)/g)?.length ?? 0;
    } else {
      numImgs = post.images?.length ?? 0;
    }
    const imgUrl = buildImgUrl(null, post.thumb_path, { size: "xs" });
    return imageWithNum(imgUrl, numImgs);
  }

  if (post.videos?.length) {
    const video = post.videos![0];
    return (
      <Box
        {...boxProps}
        height={height}
        width={width}
        position='relative'
      >
        {video.converted_at && video.thumb_path ? (
          <Image
            src={buildImgUrl(null, video.thumb_path, { size: "xs" })}
            alt='video-preview'
            width={width}
            height={height}
          />
        ) : (
          <video
            src={P.join(video.host ?? env.RESOURCE_URL, video.path)}
            style={{
              width,
              height,
              objectFit: "cover",
            }}
          />
        )}
        <PlayCircleOlIcon
          sx={{
            color: "#ffffff",
            position: "absolute",
            zIndex: 5,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </Box>
    );
  }

  if (post.images?.length) {
    const img0 = post.images[0];
    const imgUrl = buildImgUrl(img0.host ?? null, img0.path, { size: "xs" });
    return imageWithNum(imgUrl, post.images.length ?? 0);
  }
  if (post.body_type == "html") {
    const extractedImgs = retrieveHtmlImages(post.body ?? "").map((item) => item.src ?? "not defined");
    if (extractedImgs.length) {
      return imageWithNum(extractedImgs[0], extractedImgs.length);
    }
    const youtubeThumbnail = retrieveYoutubeThumbnail(post.body ?? "");
    if (youtubeThumbnail) {
      return (
        <Box
          {...boxProps}
          position='relative'
          borderRadius={borderRadius}
          overflow='hidden'
          width={width}
          height={height}
        >
          <Image
            src={youtubeThumbnail}
            alt='preview-img'
            fill
            style={{
              objectFit: "cover",
            }}
          />

          <YoutubeIcon
            sx={{
              color: "rgba(255, 0, 0, 0.6)",
              position: "absolute",
              zIndex: 5,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </Box>
      );
    }
    const tweetId = retrieveTweetId(post.body ?? "");
    if (tweetId) {
      return (
        <Box
          {...boxProps}
          width={width}
          height={height}
          position='relative'
          borderRadius={borderRadius}
          overflow='hidden'
        >
          <Image
            src='/images/twitter_x.png'
            alt='twitter_x'
            fill
            style={{
              objectFit: "cover",
            }}
          />
          <Box
            bgcolor='rgba(128, 128, 128, 0.4)'
            display='flex'
            position='absolute'
            alignItems='center'
            bottom={0}
            color='#ffffff'
            fontSize={9}
            whiteSpace='pre'
          >
            <LinkIcon sx={{ fontSize: 11, mr: 0.25 }} />
            {tweetId}
          </Box>
        </Box>
      );
    }

    const linkPreviewUrl = retrieveLinkPreviewUrl(post.body ?? "");
    if (linkPreviewUrl) {
      return (
        <Box
          {...boxProps}
          position='relative'
          width={width}
          height={height}
          borderRadius={borderRadius}
          overflow='hidden'
        >
          <LinkPreviewThumbnail
            url={linkPreviewUrl}
            width={width}
            height={height}
          />
          <Box
            bgcolor='rgba(128, 128, 128, 0.4)'
            display='flex'
            position='absolute'
            alignItems='center'
            bottom={0}
            color='#ffffff'
            fontSize={9}
            whiteSpace='pre'
          >
            <LinkIcon sx={{ fontSize: 11, mr: 0.25 }} />
            {linkPreviewUrl}
          </Box>
        </Box>
      );
    }

    const pollId = retrievePollId(post.body ?? "");
    if (pollId) {
      return (
        <Box
          {...boxProps}
          width={width}
          height={height}
          position='relative'
          borderRadius={borderRadius}
          overflow='hidden'
        >
          <Image
            src='/images/poll_sample.png'
            alt='poll_sample'
            fill
            style={{
              objectFit: "fill",
            }}
          />
        </Box>
      );
    }
  }

  return null;
}
