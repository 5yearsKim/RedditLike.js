import React, { Fragment, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { ThumbUpOlIcon, RecentIcon, PastIcon, CommentOlIcon } from "@/ui/icons";
import { Row } from "@/ui/layouts";
import { SelectableChip } from "@/ui/tools/SelectableChip";
import type { CommentSortT } from "@/types/Comment";


export type CommentSortChipsProps = {
  sort: CommentSortT;
  size?: "medium" | "small";
  onChange: (sort: CommentSortT) => void;
};


export function CommentSortChips({
  sort,
  size,
  onChange,
}: CommentSortChipsProps): JSX.Element {
  const t = useTranslations("components.CommentSortChips");

  const sortChips: { label: string; key: CommentSortT; icon: any }[] = [
    { label: t("sortVote"), key: "vote", icon: <ThumbUpOlIcon fontSize='small' /> },
    {
      label: t("sortDiscussed"),
      key: "discussed",
      icon: <CommentOlIcon fontSize='small' />,
    },
    { label: t("sortOld"), key: "old", icon: <PastIcon fontSize='small' /> },
    { label: t("sortRecent"), key: "recent", icon: <RecentIcon fontSize='small' /> },
  ];


  function handleSortChipClick(e: MouseEvent<Element>, val: CommentSortT): void {
    e.preventDefault();
    onChange(val);
  }


  return (
    <Row
      justifyContent='flex-start'
      spacing={0.75}
    >
      {sortChips.map((item) => {
        const selected = sort === item.key;
        return (
          <Fragment key={item.key}>
            <SelectableChip
              label={item.label}
              icon={item.icon}
              selected={selected}
              size={size}
              onClick={(e): void => handleSortChipClick(e, item.key)}
            />
          </Fragment>
        );
      })}
    </Row>
  );
}
