import React from "react";

import type { PostPreviewProps, PostPreviewSkeletonProps } from "./type";
import { PostPreviewSMView } from "./view_sm";
import { PostPreviewMDView } from "./view_md";
import { PostPreviewSkeletonMD } from "./skeleton_md";
import { PostPreviewSkeletonSM } from "./skeleton_sm";

function SizeWrapper(props: PostPreviewProps): JSX.Element {
  if (props.size == "small") {
    return <PostPreviewSMView {...props} />;
  } else {
    return <PostPreviewMDView {...props} />;
  }
}

export type { PostPreviewProps };

export const PostPreview = React.memo(SizeWrapper, (p, n) => {
  return p.post == n.post && p.size == n.size;
});

export function PostPreviewSkeleton({ size }: PostPreviewSkeletonProps): JSX.Element {

  if (size == "small") {
    return <PostPreviewSkeletonSM />;
  } else {
    return <PostPreviewSkeletonMD />;
  }
}
