import React from "react";
import { Container } from "@/ui/layouts";
import { CommentList } from "@/components/CommentList";
import type { UserT, ListCommentOptionT } from "@/types";

type CommentTabProps = {
  me: UserT;
};

export function CommentTab(props: CommentTabProps): JSX.Element {
  const { me } = props;

  const listOpt: ListCommentOptionT = {
    authorId: me.id,
    sort: "recent",
    censor: "exceptTrashed",
    $defaults: true,
    $user_defaults: true,
    $parent: true,
    $post: true,
  };

  return (
    <Container maxWidth='sm'>
      <CommentList listOpt={listOpt} />
    </Container>
  );
}
