import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Row, Col, Gap, Box } from "@/ui/layouts";
import { SelectableChip } from "@/ui/tools/SelectableChip";
import { RetryIcon } from "@/ui/icons";
import { IconButton } from "@mui/material";
import { BoardList } from "@/components/BoardList";
import { CategoryItem } from "@/components/CategoryItem";
import { BoardSortChips } from "@/components/BoardSortChips";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { BoardPreviewItem } from "./BoardPreviewItem";
import type { ListBoardOptionT, BoardSortT, CategoryT } from "@/types";


export function CategoryBoardSection(): JSX.Element {
  const t = useTranslations("pages.AdminPage.CategoryTab.CategoryBoardSection");
  const [regenCnt, setRegenCnt] = useState<number>(0);
  const [sort, setSort] = useState<BoardSortT>("recent");
  const [selectedCategory, setSelectedCategory] = useState<CategoryT | null>(null);
  const { data: categories$ } = useCategoriesStore();

  function handleRegenClick(): void {
    setRegenCnt((cnt) => cnt + 1);
  }

  const categories = categories$.data;

  const listOpt: ListBoardOptionT = {
    categoryId: selectedCategory?.id ?? "except",
    sort,
    censor: "exceptTrashed",
    $user_defaults: true,
  };

  return (
    <Col>
      <Row
        display='flex'
        flexWrap='wrap'
        columnGap={1}
      >
        <SelectableChip
          label={t("noCategory")}
          selected={selectedCategory == null}
          onClick={() => setSelectedCategory(null)}
        />

        {categories.map((category) => {
          return (
            <CategoryItem
              key={category.id}
              category={category}
              selected={selectedCategory?.id == category.id}
              onClick={() => setSelectedCategory(category)}
            />
          );
        })}
      </Row>

      <Row justifyContent='flex-end'>
        <IconButton onClick={handleRegenClick}>
          <RetryIcon/>
        </IconButton>

        <BoardSortChips
          sort={sort}
          onChange={(sort) => setSort(sort)}
        />
      </Row>

      <Gap y={2} />

      <Box width={500} margin='auto' >
        <BoardList
          listOption={listOpt}
          regenCnt={regenCnt}
          renderItem={(board): JSX.Element => <BoardPreviewItem board={board} />}
        />
      </Box>
    </Col>
  );
}