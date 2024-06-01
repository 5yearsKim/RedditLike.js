import React, { Fragment, useEffect, useState, MouseEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Row } from "@/ui/layouts";
import { HotIcon, ThumbUpOlIcon, RecentIcon, CommentOlIcon } from "@/ui/icons";
import { SelectableChip } from "@/ui/tools/SelectableChip";
import { RangeSelector } from "@/components/RangeSelector";

import type { PostSortT } from "@/types/Post";

import { startOfHour, subDays } from "date-fns";

type PostSortChipsProps = {
  sort: PostSortT;
  size?: "medium" | "small";
  onChange: (sort: PostSortT) => void;
  onFromAtChange: (fromAt: Date | undefined) => void;
};


export function PostSortChips({
  sort: _sort,
  size,
  onChange,
  onFromAtChange,
}: PostSortChipsProps): ReactNode {
  const t = useTranslations("components.PostSortChips");

  const sortChips: {
    label: string;
    key: PostSortT;
    icon: any;
    showRange: boolean;
  }[] = [
    {
      label: t("sortHot"),
      key: "hot",
      icon: <HotIcon fontSize='small' />,
      showRange: false,
    },
    {
      label: t("sortRecent"),
      key: "recent",
      icon: <RecentIcon fontSize='small' />,
      showRange: false,
    },
    {
      label: t("sortVote"),
      key: "vote",
      icon: <ThumbUpOlIcon fontSize='small' />,
      showRange: true,
    },
    {
      label: t("sortDiscussed"),
      key: "discussed",
      icon: <CommentOlIcon fontSize='small' />,
      showRange: true,
    },
  ];

  const [sort, setSort] = useState<PostSortT>("hot");

  // to solve localstorage sync problem
  useEffect(() => {
    setSort(_sort);
  }, [_sort]);

  const initialFromAt = "7d";

  function handleSortChipClick(e: MouseEvent, val: PostSortT): void {
    e.preventDefault();
    onChange(val);
    if (val === "hot" || val === "recent") {
      onFromAtChange(undefined);
    }
    if (val === "discussed" || val === "vote") {
      const fromAt = startOfHour(subDays(new Date(), 7));
      onFromAtChange(fromAt);
    }
  }

  function handleFromAtChange(fromAt: undefined | Date): void {
    onFromAtChange(fromAt);
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
              size={size}
              label={item.label}
              icon={item.icon}
              selected={selected}
              onClick={(e): void => handleSortChipClick(e, item.key)}
            />
            {item.showRange && selected && (
              <RangeSelector
                initialRange={initialFromAt as any}
                candidates={["1d", "7d", "1M", "3M", "1y", "all"]}
                onChange={handleFromAtChange}
              />
            )}
          </Fragment>
        );
      })}
    </Row>
  );
}
