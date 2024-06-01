"use client";

import { atom, useSetRecoilState } from "recoil";
import { PostT } from "@/types";

type PostDialogStateT = {
  postId: idT | null;
  post: PostT | null;
};

export const postDialogState = atom<PostDialogStateT>({
  key: "postDialogState",
  default: {
    postId: null,
    post: null,
  },
});

// eslint-disable-next-line
export function usePostDialog() {
  const setState = useSetRecoilState(postDialogState);

  function openPostDialogById(postId: idT): void {
    setState({
      postId,
      post: null,
    });
  }

  function openPostDialog(post: PostT): void {
    setState({
      postId: post.id,
      post,
    });
  }

  function closePostDialog(): void {
    setState({
      postId: null,
      post: null,
    });
  }

  return {
    openPostDialog,
    openPostDialogById,
    closePostDialog,
  };
}
