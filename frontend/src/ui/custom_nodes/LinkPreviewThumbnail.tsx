import React, { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import * as UrlInfoApi from "@/apis/url_infos";
import type { UrlInfoT } from "@/types/UrlInfo";

type LinkPreviewThumbnailProps = {
  url: string;
  width: number;
  height: number;
};

export function LinkPreviewThumbnail({
  url,
  width,
  height,
}: LinkPreviewThumbnailProps): ReactNode {

  const [urlInfo, setUrlInfo] = useState<UrlInfoT | null>(null);
  const [isImageError, setIsImageError] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

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
      <Image
        src='/images/no-image.jpeg'
        alt='preview'
        className='link-preview-img'
        width={width}
        height={height}
        style={{
          objectFit: "cover",
        }}
      />
    );
  }
  if (!urlInfo) {
    return (
      <Skeleton
        width={width}
        height={height}
      />
    );
  }

  return (
    <Image
      src={isImageError ? "/images/no-image.jpeg" : urlInfo.image ?? ""}
      alt='preview'
      width={width}
      height={height}
      className='link-preview-img'
      style={{
        objectFit: "cover",
      }}
      onError={(): void => {
        if (!isImageError) {
          setIsImageError(true);
        }
      }}
    />
  );
}
