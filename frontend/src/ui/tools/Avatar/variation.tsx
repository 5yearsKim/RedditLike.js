import React from "react";
import { Avatar as MuiAvatar } from "@mui/material";
import { buildImgUrl } from "@/utils/media";
import { Avatar } from "./view";
import type { GroupT, GroupFormT, AuthorT, BoardT, BoardFormT } from "@/types";


type GroupAvatarProps = {
  group: GroupT|GroupFormT;
  size?: number | string;
}

export function GroupAvatar({
  group,
  size,
}: GroupAvatarProps): JSX.Element {
  return (
    <Avatar
      src={group.avatar_path ? buildImgUrl(null, group.avatar_path, { size: "xs" } ) : undefined}
      alt={"group-" + group.name}
      letter={group.name.slice(0, 1)}
      rseed={ "id" in group ? group.id : 0}
      size={size}
      variant='rounded'
      sx={{
        boxShadow: group.avatar_path ? "0 0 1px 1px rgba(0, 0, 0, 0.2)" : undefined,
      }}
    />
  );
}

type BoardAvatarProps = {
  board: BoardT|BoardFormT;
  size?: number | string;
};

export function BoardAvatar({
  board,
  size,
}: BoardAvatarProps): JSX.Element {

  return (
    <Avatar
      src={board.avatar_path ? buildImgUrl(null, board.avatar_path, { size: "xs" } ) : undefined}
      alt={"board-" + board.name}
      letter={board.name.slice(0, 1)}
      rseed={ "id" in board ? board.id : 0}
      size={size}
      sx={{
        boxShadow: board.avatar_path ? "0 0 1px 1px rgba(0, 0, 0, 0.2)" : undefined,
      }}
    />
  );
}

type AuthorAvatarProps = {
  author: AuthorT | null;
  size?: number | string;
};

export function AuthorAvatar({
  author,
  size,
}: AuthorAvatarProps): JSX.Element {

  const imgUrl = (() => {
    if (!author) {
      return undefined;
    }
    if (author.avatar_path) {
      return buildImgUrl(null, author.avatar_path, { size: "xs" });
    }
    if (author.default_avatar_path) {
      return buildImgUrl(null, author.default_avatar_path, { size: "xs" });
    }
    return undefined;
  })();

  return (
    <MuiAvatar
      src={imgUrl}
      alt='author-avatar'
      sx={{
        width: size,
        height: size,
        userSelect: "none",
        pointerEvents: "none",
        border: imgUrl ? "solid 1px #dddddd" : undefined,
      }}
    />
  );
}
