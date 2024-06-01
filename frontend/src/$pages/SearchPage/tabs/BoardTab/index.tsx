import React from "react";
import { Container } from "@/ui/layouts";
import { BoardList } from "@/components/BoardList";
import { useGroup } from "@/stores/GroupStore";
import type { ListBoardOptionT } from "@/types";

type SearchBoardProps = {
  q: string;
};

export function BoardTab({ q }: SearchBoardProps): JSX.Element {
  const group = useGroup();

  const listOpt: ListBoardOptionT = {
    groupId: group.id,
    sort: "recent",
    search: q,
    censor: "exceptTrashed",
    $user_defaults: true,
  };

  return (
    <Container maxWidth='sm'>
      <BoardList listOption={listOpt} />
    </Container>
  );
}
