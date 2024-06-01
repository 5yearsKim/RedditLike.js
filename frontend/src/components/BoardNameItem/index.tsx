import React, { Fragment } from "react";
import { Box } from "@/ui/layouts";
import { Clickable } from "@/ui/tools/Clickable";
import { Txt } from "@/ui/texts";
import { BoardAvatar } from "@/ui/tools/Avatar";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { usePostDialog } from "@/hooks/dialogs/PostDialog";
// import { BoxProps } from '@mui/material';
import type { BoardT } from "@/types";

interface BoardNameItemProps {
  board: BoardT;
  avatarSize?: string;
  textVariant?: "body3" | "body2" | "body1";
  disabled?: boolean;
}

export function BoardNameItem({
  board,
  avatarSize,
  textVariant,
  disabled,
}: BoardNameItemProps): JSX.Element {
  const router = useRouter();
  const { closePostDialog } = usePostDialog();

  function handleClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/boards/${board.id}`);
    closePostDialog();
  }

  return (
    <Clickable
      py={0.5}
      pl={0.2}
      pr={0.5}
      mr={0.5}
      aria-label={board.name}
      borderRadius={1}
      onClick={handleClick}
      disabled={disabled}
    >
      <Fragment>
        <BoardAvatar
          board={board}
          size={avatarSize ?? "22px"}
        />
        <Box mr={0.75} />
        <Txt
          variant={textVariant ?? "body2"}
          fontWeight={700}
          whiteSpace='nowrap'
        >
          {board.name}
        </Txt>
      </Fragment>
    </Clickable>
  );
}
