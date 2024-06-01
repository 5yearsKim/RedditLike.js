"use client";

import React, { ChangeEvent, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useSnackbar } from "@/hooks/Snackbar";
import { Row, Col } from "@/ui/layouts";
import * as PostApi from "@/apis/posts";
import type { PostT } from "@/types";

type PostSearchSectionProps = {
  onPostFetched: (post: PostT) => void;
};

export function PostSearchSection(props: PostSearchSectionProps): JSX.Element {
  const { onPostFetched } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [postId, setPostId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submitDisable = isSubmitting || !postId;

  function handlePostIdChange(e: ChangeEvent<HTMLInputElement>): void {
    setPostId(e.target.value);
  }

  async function handleFindClick(): Promise<void> {
    try {
      setIsSubmitting(true);
      const { data: post } = await PostApi.get(postId as any, {});
      onPostFetched(post);

      setIsSubmitting(false);
    } catch (e) {
      setIsSubmitting(false);
      const detailError = (e as any)?.response.data ?? "unknown error";

      enqueueSnackbar(`cannot fetch post with ${JSON.stringify(detailError)}`, { variant: "error" });
    }
  }

  return (
    <Col>
      <Row justifyContent='center'>
        <TextField
          label='postId'
          placeholder='ex) 123'
          autoComplete='off'
          value={postId}
          onChange={handlePostIdChange}
        />
      </Row>
      <Button
        variant='contained'
        disabled={submitDisable}
        onClick={handleFindClick}
      >
        find post
      </Button>
    </Col>
  );
}
