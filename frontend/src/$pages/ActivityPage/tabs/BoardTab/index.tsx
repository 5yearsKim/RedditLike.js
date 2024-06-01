"use client";
import React from "react";
import { Container } from "@/ui/layouts";
import { useMe } from "@/stores/UserStore";
import { BoardList } from "@/components/BoardList";
import type { ListBoardOptionT } from "@/types";

export function BoardTab(): JSX.Element {
  const me = useMe();

  const listOption: ListBoardOptionT = {
    sort: "recent",
    following: "only",
    userId: me?.id,
    censor: "exceptTrashed",
    $user_defaults: true,
  };

  return (
    <Container maxWidth='sm'>
      <BoardList listOption={listOption} />
    </Container>
  );
}
