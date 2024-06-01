import React, { Fragment, ReactNode } from "react";
import Link from "next/link";
import { List, ListItemButton, CircularProgress } from "@mui/material";
import { ErrorButton } from "@/components/$statusTools";
import { Expand, Gap, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardAvatar } from "@/ui/tools/Avatar";
import { ListView } from "@/ui/tools/ListView";
import type { BoardT } from "@/types";

type BoardSectionListProps = {
  status: ProcessStatusT;
  boards: BoardT[];
  onLoaderDetect: () => any;
  onRetry: () => any;
  onBoardClick: (board: BoardT) => any;
};


export function BoardSectionList({
  status,
  boards,
  onLoaderDetect,
  onRetry,
  onBoardClick,
}: BoardSectionListProps): ReactNode {

  if (status === "loading") {
    return (
      <Center>
        <CircularProgress />
      </Center>
    );
  }
  if (status === "error") {
    return (
      <Center>
        <ErrorButton onRetry={onRetry} />;
      </Center>
    );
  }

  return (
    <List>
      <ListView
        data={boards}
        onLoaderDetect={onLoaderDetect}
        renderItem={(board): JSX.Element => {
          return (
            <Fragment key={board.id}>
              <Link href={`/boards/${board.id}`}>
                <ListItemButton onClick={(): void => onBoardClick(board)}>
                  <BoardAvatar
                    board={board}
                    size='30px'
                  />
                  <Gap x={2} />
                  <Expand>
                    <Txt>{board.name}</Txt>
                  </Expand>
                </ListItemButton>
              </Link>
            </Fragment>
          );
        }}
      />
    </List>
  );
}
