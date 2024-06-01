import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useMe } from "@/stores/UserStore";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { Voter } from "./voter";
import * as CommentVoteApi from "@/apis/comment_votes";
import * as PostVoteApi from "@/apis/post_votes";
import type { PostT, CommentT } from "@/types";

type PostVoterProps = {
  isHorizontal?: boolean;
  post: PostT;
  size?: "small" | "medium";
  onUpdated: (post: PostT) => void;
};

export function PostVoter({
  isHorizontal,
  post,
  size,
  onUpdated,
}: PostVoterProps): ReactNode {
  const t = useTranslations("components.Voter");

  const { showAlertDialog } = useAlertDialog();

  const me = useMe();

  async function handleVote(score: number): Promise<void> {
    if (me && post.author?.id == me?.id) {
      showAlertDialog({
        body: t("cantVoteMyPost"),
        useOk: true,
      });
      throw "VOTE_MINE";
    }
    const postVote = await PostVoteApi.score(post.id, score);
    if (postVote) {
      const diff = score - (post.my_score ?? 0);
      onUpdated({
        ...post,
        my_score: score,
        score: (post.score ?? 0) + diff,
      });
    }
  }

  return (
    <Voter
      isHorizontal={isHorizontal}
      numVote={post.num_vote ?? 0}
      score={post.score ?? 0}
      myScore={post.my_score}
      size={size}
      onVote={handleVote}
    />
  );
}

type CommentVoterProps = {
  isHorizontal?: boolean;
  comment: CommentT;
  size?: "small" | "medium";
  onUpdated: (comment: CommentT) => void;
};

export function CommentVoter({
  isHorizontal,
  comment,
  size,
  onUpdated,
}: CommentVoterProps): ReactNode {
  const t = useTranslations("components.Voter");

  const { showAlertDialog } = useAlertDialog();

  const me = useMe();

  async function handleVote(score: number): Promise<void> {
    if (me && comment.author?.id == me?.id) {
      showAlertDialog({
        body: t("cantVoteMyComment"),
        useOk: true,
      });
      throw "VOTE_MINE";
    }

    const commentVote = await CommentVoteApi.score(comment.id, score);

    if (commentVote) {
      const diff = score - (comment.my_score ?? 0);
      onUpdated({
        ...comment,
        my_score: score,
        score: (comment.score ?? 0) + diff,
      });
    }
  }

  return (
    <Voter
      isHorizontal={isHorizontal}
      numVote={comment.num_vote ?? 0}
      score={comment.score ?? 0}
      myScore={comment.my_score}
      size={size}
      onVote={handleVote}
    />
  );
}
