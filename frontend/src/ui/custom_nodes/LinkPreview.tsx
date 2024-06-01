import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useResponsive } from "@/hooks/Responsive";
import * as UrlInfoApi from "@/apis/url_infos";
import { Box, Skeleton } from "@mui/material";
import { Col, Center, Gap } from "@/ui/layouts";
import { Txt, EllipsisTxt } from "@/ui/texts";
import type { UrlInfoT } from "@/types/UrlInfo";

type LinkPreviewProps = {
  url: string;
};

export function LinkPreview({ url }: LinkPreviewProps): ReactNode {

  const [urlInfo, setUrlInfo] = useState<UrlInfoT | null>(null);
  const [isImageError, setIsImageError] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { downSm } = useResponsive();

  const height = downSm ? 90 : 100;

  useEffect(() => {
    _init();
  }, []);

  async function _init(): Promise<void> {
    try {
      const urlInfo = await UrlInfoApi.inspect(url);
      setUrlInfo(urlInfo);
    } catch (e) {
      setIsError(true);
    }
  }

  if (isError) {
    return (
      <PreviewBox
        url={url}
        image={
          <Image
            src='/images/no-image.jpeg'
            alt='preview'
            width={height}
            height={height}
            style={{
              objectFit: "cover",
            }}
          />
        }
        height={height}
        content={
          <Col
            height='100%'
            justifyContent='center'
          >
            <EllipsisTxt
              maxLines={1}
              variant='body3'
              color='vague.main'
            >
              {url}
            </EllipsisTxt>
            <Txt variant='body3' color='vague.main'>웹사이트 정보를 가져올 수 없습니다.</Txt>
          </Col>
        }
      />
    );
  }

  if (!urlInfo) {
    return (
      <PreviewBox
        url={url}
        image={
          <Skeleton
            width={height}
            height={height}
            variant='rectangular'
          />
        }
        height={height}
        content={
          <Col
            height='100%'
            justifyContent='center'
          >
            <Skeleton
              width='150px'
              height='20px'
            />
            <Skeleton
              width='200px'
              height='20px'
            />
            <Skeleton
              width='200px'
              height='20px'
            />
          </Col>
        }
      />
    );
  }
  return (
    <PreviewBox
      url={url}
      image={
        // <Box bgcolor='#ff00ff' width='100%' height='100%'/>
        <Image
          src={isImageError ? "/images/no-image.jpeg" : urlInfo.image ?? "/images/no-image.jpeg"}
          alt='preview'
          // width={downSm ? 80 : 100}
          // height={downSm ? 60 : 80}
          width={height}
          height={height}
          // fill
          style={{
            objectFit: "cover",
          }}
          onError={(): void => {
            if (!isImageError) {
              setIsImageError(true);
            }
          }}
        />
      }
      height={height}
      content={
        <Col
          height='100%'
          justifyContent='center'
        >
          <EllipsisTxt
            maxLines={1}
            variant='body3'
            color='vague.main'
          >
            {url}
          </EllipsisTxt>
          <EllipsisTxt
            maxLines={1}
            variant='body3'
            fontWeight={500}
          >
            {urlInfo.title}
          </EllipsisTxt>
          <EllipsisTxt
            maxLines={2}
            variant='body3'
            color='vague.main'
          >
            {urlInfo.description}
          </EllipsisTxt>
        </Col>
      }
    />
  );
}

type PreviewBoxProps = {
  url: string;
  image: JSX.Element;
  content: JSX.Element;
  height: string | number;
};

function PreviewBox({ url, image, content, height }: PreviewBoxProps): ReactNode {
  return (
    <Link
      href={url}
      target='_blank'
      style={{ padding: 0 }}
    >
      <Box
        position='relative'
        my={2}
        mx={0.2}
        boxShadow={2}
        borderRadius={2}
        bgcolor='rgba(255, 255, 255, 0.1)'
        display='flex'
        overflow='hidden'
        minHeight={height}
        sx={{
          "&:hover": {
            bgcolor: "rgba(200, 200, 200, 0.1)",
          },
        }}
      >
        <Center
          position='relative'
          bgcolor='#ffffff'
          height={height}
          width={height}
        >
          {image}
        </Center>
        <Gap x={2} />
        <Box flex={1}>{content}</Box>
      </Box>
    </Link>
  );
}
