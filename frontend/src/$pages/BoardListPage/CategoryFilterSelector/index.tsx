"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useResponsive } from "@/hooks/Responsive";
import { Box } from "@mui/material";
import { Row } from "@/ui/layouts";
import { SelectableChip } from "@/ui/tools/SelectableChip";
import { CategoryItem } from "@/components/CategoryItem";
import { AllCategoryButton } from "./AllCategoryButton";
// logic
import { atom, useRecoilState } from "recoil";
import { useCategoriesStore, getCategoriesListOpt } from "@/stores/CategoriesStore";
import { useMe } from "@/stores/UserStore";
import type { CategoryT } from "@/types/Category";


type CategoryFilterSelectorProps = {
  filterId: idT | null;
  onFilterChange: (val: CategoryT | null) => void;
};

const categoriesState = atom<CategoryT[]>({
  key: "categoriesState_CategoryFilterSelector",
  default: [],
});


export function CategoryFilterSelector({
  filterId,
  onFilterChange,
}: CategoryFilterSelectorProps): JSX.Element {
  const t = useTranslations("pages.BoardListPage.CategoryFilterSelector");

  const { downSm } = useResponsive();
  const { data: categories$, actions: categoriesAct } = useCategoriesStore();
  const me = useMe();

  const [categories, setCategories] = useRecoilState(categoriesState);

  // need to setup category

  const listOpt = getCategoriesListOpt({ userId: me?.id });

  useEffect(() => {
    categoriesAct.load(listOpt);
  }, [JSON.stringify(listOpt)]);

  useEffect(() => {
    if (categories.length == 0) {
      const myLikesCategories = categories$.data.filter((item) => item.my_like);
      if (myLikesCategories.length > 0) {
        setCategories(myLikesCategories);
      } else {
        setCategories(categories$.data);
      }
    }
  }, [categories$.data]);


  function handleFilterClick(val: CategoryT | null): void {
    onFilterChange(val);
  }

  function handleCategoryUpdate(categories: CategoryT[]): void {
    setCategories(categories);
  }

  return (
    <Row>
      <SelectableChip
        label={t("all")}
        selected={filterId == null}
        borderRadius={2}
        size={downSm ? "small" : "medium"}
        onClick={(): void => handleFilterClick(null)}
      />
      <Box mr={0.5} />
      {categories.map((item) => {
        return (
          <Box
            m={1 / 4}
            key={item.id}
          >
            <CategoryItem
              category={item}
              selected={filterId === item.id}
              size={downSm ? "small" : "medium"}
              onClick={(): void => handleFilterClick(item)}
            />
          </Box>
        );
      })}
      <AllCategoryButton
        categories={categories}
        size={downSm ? "small" : "medium"}
        onUpdate={handleCategoryUpdate}
      />
    </Row>
  );
}
