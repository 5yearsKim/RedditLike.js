"use client";

import React, { useState } from "react";
import { Button, IconButton } from "@mui/material";
import { useSnackbar } from "@/hooks/Snackbar";
import { Container, Row } from "@/ui/layouts";
import { RetryIcon } from "@/ui/icons";
import * as PostApi from "@/apis/posts";
import { PostSearchSection } from "./PostSearchSection";
import { PostResultSection } from "./PostResultSection";
import type { PostT } from "@/types";

export function PostTab(): JSX.Element {
  const [post, setPost] = useState<PostT | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  function handlePostFetched(post: PostT): void {
    setPost(post);
  }

  function handleResetPost(): void {
    setPost(null);
  }

  async function handleRefreshClick(): Promise<void> {
    if (!post) {
      return;
    }
    try {
      const { data: fetched } = await PostApi.get(post.id, { $defaults: true });
      setPost(fetched);
    } catch (e) {
      const detailError = (e as any)?.response.data ?? "unknown error";

      enqueueSnackbar(`cannot fetch post with ${JSON.stringify(detailError)}`, { variant: "error" });
    }
  }

  return (
    <Container rtlP>
      {post == null ? (
        <PostSearchSection onPostFetched={handlePostFetched} />
      ) : (
        <div>
          <Row>
            <Button onClick={handleResetPost}>reset</Button>
            <IconButton onClick={handleRefreshClick}>
              <RetryIcon />
            </IconButton>
          </Row>
          <PostResultSection post={post} />
        </div>
      )}
    </Container>
  );
}
