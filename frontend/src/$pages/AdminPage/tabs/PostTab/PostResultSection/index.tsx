import React from "react";
import { Box } from "@mui/material";
import { usePostDialog } from "@/hooks/dialogs/PostDialog";
import { PostPreview } from "@/components/PostPreview";
import type { PostT } from "@/types";

type PostResultSectionProps = {
  post: PostT;
};

export function PostResultSection(props: PostResultSectionProps): JSX.Element {
  const { post } = props;

  const { openPostDialog } = usePostDialog();

  function handlePostPreviewClick(): void {
    openPostDialog(post);
  }

  return (
    <>
      <Box
        width='100%'
        onClick={handlePostPreviewClick}
      >
        <PostPreview post={post} />
      </Box>


    </>
  );
}
