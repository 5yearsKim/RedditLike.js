import React, { ReactNode } from "react";
import { buildImgUrl } from "@/utils/media";

type PostImageProps = {
  path: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function PostImage({
  path,
  alt,
  width,
  height,
}: PostImageProps): ReactNode {

  const aspectRatio = width && height ? `${width}/${height}` : undefined;

  return (
    <img
      src={buildImgUrl(null, path)}
      alt={alt ?? "image"}
      className='select-visible post-image'
      style={{
        aspectRatio,
        backgroundColor: "rgba(100, 100, 100, 0.2)",
      }}
    />
  );
}