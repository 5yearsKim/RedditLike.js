import React, { useEffect } from "react";
import { BoardSection } from "../style";
import { BoardSectionList } from "../BoardSectionList";
import { useMe } from "@/stores/UserStore";
import { useFollowingBoardsStore, getFollowingBoardsListOpt } from "@/stores/FollowingBoardsStore";
import type { BoardT } from "@/types";

export type FollowingBoardSectionProps = {
  title: string
  onNavigateBoard: (board: BoardT) => void;
};

export function FollowingBoardSection({
  title,
  onNavigateBoard,
}: FollowingBoardSectionProps): JSX.Element {

  const me = useMe();
  const { data: followingBoards$, actions: followingBoardsAct } = useFollowingBoardsStore();

  const listOpt = getFollowingBoardsListOpt({ userId: me?.id });

  useEffect(() => {
    followingBoardsAct.load(listOpt);
  }, [JSON.stringify(listOpt)]);

  function handleRegenClick(): void {
    followingBoardsAct.load(listOpt, { force: true });
  }

  function handleBoardClick(board: BoardT): void {
    onNavigateBoard(board);
  }

  function handleLoaderDetect(): void {
    followingBoardsAct.refill();
  }

  function handleErrorRetry(): void {
    followingBoardsAct.load(listOpt, { force: true });
  }

  const { status, data: boards } = followingBoards$;

  return (
    <BoardSection
      storageKey='DrawerOpen/following'
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
