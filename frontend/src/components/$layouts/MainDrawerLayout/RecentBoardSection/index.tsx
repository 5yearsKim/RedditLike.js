import React, { Fragment, MouseEvent } from "react";
import { List, ListItemButton, IconButton } from "@mui/material";
import { CloseIcon } from "@/ui/icons";
import { Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardAvatar } from "@/ui/tools/Avatar";
import { BoardSection } from "../style";
import { useRecentBoards, useRecentBoardsActions } from "@/stores/RecentBoardsStore";
import type { BoardT } from "@/types";

export type RecentBoardSectionProps = {
  title: string
  onNavigateBoard: (board: BoardT) => void;
};

export function RecentBoardSection({
  title,
  onNavigateBoard,
}: RecentBoardSectionProps): JSX.Element {

  const recentBoards$ = useRecentBoards();
  const recentBoardsAct = useRecentBoardsActions();

  function handleClick(e: MouseEvent<HTMLElement>, board: BoardT): void {
    e.preventDefault();
    onNavigateBoard(board);
  }

  function handleDelete(e: MouseEvent<HTMLButtonElement>, board: BoardT): void {
    e.stopPropagation();
    e.preventDefault();
    recentBoardsAct.removeById(board.id);
  }

  const { data: recentBoards } = recentBoards$;

  return (
    <BoardSection
      storageKey='DrawerOpen/recent'
      title={title}
    >
      <List>
        {recentBoards.map((board) => {
          return (
            <Fragment key={board.id}>
              <ListItemButton onClick={(e): void => handleClick(e, board)}>
                <BoardAvatar
                  board={board}
                  size='30px'
                />
                <Gap x={2} />
                <Expand>
                  <Txt>{board.name}</Txt>
                </Expand>
                <IconButton
                  aria-label='close-recent-board-item'
                  onClick={(e): void => handleDelete(e, board)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItemButton>
            </Fragment>
          );
        })}
      </List>
    </BoardSection>
  );
}
