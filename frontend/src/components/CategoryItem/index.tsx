import React, { MouseEvent } from "react";
import { SelectableChip } from "@/ui/tools/SelectableChip";
import { IconButton } from "@mui/material";
import { StarIcon } from "@/ui/icons";
import type { CategoryT } from "@/types/Category";

type CategoryItemProps = {
  category: CategoryT;
  selected: boolean;
  likable?: boolean;
  size?: "small" | "medium";
  onClick: (e: MouseEvent<HTMLElement>) => void;
  onLikeClick?: (e: MouseEvent<HTMLElement>) => void;
};

export function CategoryItem(props: CategoryItemProps): JSX.Element {
  const { category, selected, likable, size, onClick, onLikeClick } = props;

  const likeStyle = {
    color: "#ffff44",
    // stroke: '#bbbbbb',
    // strokeWidth: 1,
  };

  return (
    <SelectableChip
      selected={selected}
      label={category.label}
      onClick={onClick}
      size={size}
      borderRadius={2}
      icon={
        likable && (
          <IconButton
            aria-label='subscribe-board-button'
            size='small'
            onClick={onLikeClick}
            sx={{ margin: 0, padding: 0 }}
          >
            <StarIcon
              sx={{
                ...(category.my_like ? likeStyle : {}),
              }}
            />
          </IconButton>
        )
      }
    />
  );
}
