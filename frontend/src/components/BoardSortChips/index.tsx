"use client";
import React, { useState, useEffect, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Row } from "@/ui/layouts";
import { GroupIcon, RecentIcon, HotIcon } from "@/ui/icons";
import { SelectableChip } from "@/ui/tools/SelectableChip";
import { BoardSortT } from "@/types/Board";


export type BoardSortChipsProps = {
  sort: BoardSortT;
  size?: "medium" | "small";
  onChange: (sort: BoardSortT) => void;
};

export function BoardSortChips({
  sort: _sort,
  size,
  onChange,
}: BoardSortChipsProps): JSX.Element {
  const t = useTranslations("components.BoardSortChips");


  const sortChips: { label: string; key: BoardSortT; icon: any }[] = [
    { label: t("sortActive"), key: "hot", icon: <HotIcon fontSize='small' /> },
    { label: t("sortFollower"), key: "follower", icon: <GroupIcon fontSize='small' /> },
    { label: t("sortRecentCreated"), key: "recent", icon: <RecentIcon fontSize='small' /> },
  ];

  const [sort, setSort] = useState<BoardSortT>("hot");
  useEffect(() => {
    setSort(_sort);
  }, [_sort]);

  function handleSortChipClick(e: MouseEvent, val: BoardSortT): void {
    e.preventDefault();
    onChange(val);
  }

  return (
    <Row columnGap={0.5}>
      {sortChips.map((item) => {
        return (
          <SelectableChip
            key={item.key}
            label={item.label}
            size={size}
            icon={item.icon}
            selected={sort === item.key}
            onClick={(e): void => handleSortChipClick(e, item.key as BoardSortT)}
          />
        );
      })}
    </Row>
  );
}
