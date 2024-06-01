import React, { useEffect, Fragment } from "react";
import { BoardSection } from "../style";
import { BoardSectionList } from "../BoardSectionList";
import { useMe } from "@/stores/UserStore";
import { getManagingBoardsListOpt, useManagingBoardsStore } from "@/stores/ManagingBoardsStore";
import type { BoardT } from "@/types";

type ManagingBoardSectionProps = {
  title: string
  onNavigateBoard: (board: BoardT) => void;
};

export function ManagingBoardSection({
  title,
  onNavigateBoard,
}: ManagingBoardSectionProps): JSX.Element {

  const me = useMe();
  const { data: managingBoards$, actions: managingBoardsAct } = useManagingBoardsStore();

  const listOpt = getManagingBoardsListOpt({ userId: me?.id });

  useEffect(() => {
    managingBoardsAct.load(listOpt);
  }, [JSON.stringify(listOpt)]);

  function handleRegenClick(): void {
    managingBoardsAct.load(listOpt, { force: true });
  }

  function handleBoardClick(board: BoardT): void {
    onNavigateBoard(board);
  }

  function handleLoaderDetect(): void {
    managingBoardsAct.refill();
  }

  function handleErrorRetry(): void {
    managingBoardsAct.load(listOpt, { force: true });
  }


  const { status, data: boards } = managingBoards$;

  // not loaded or empty -> render None
  if (status !== "loaded" || !boards.length) {
    return <Fragment />;
  }

  return (
    <BoardSection
      storageKey='DrawerOpen/managing'
      title={title}
      onRegenClick={handleRegenClick}
    >
      <BoardSectionList
        boards={boards}
        status={status}
        onRetry={handleErrorRetry}
        onLoaderDetect={handleLoaderDetect}
        onBoardClick={(board): void => handleBoardClick(board)}
      />
    </BoardSection>
  );
}
