"use client";
import React, { useEffect, ReactNode, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { useResponsive } from "@/hooks/Responsive";
import { CategoryItem } from "@/components/CategoryItem";
import { LoadingBox, ErrorBox, InitBox } from "@/components/$statusTools";
import { Box, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CloseIcon } from "@/ui/icons";
// logic
import { useCategoriesStore, getCategoriesListOpt } from "@/stores/CategoriesStore";
import { useMe } from "@/stores/UserStore";
import { useGroup } from "@/stores/GroupStore";
import * as CategoryApi from "@/apis/categories";
import * as XUserCategoryApi from "@/apis/x_user_category";
import { CategoryT } from "@/types/Category";

export type CategorySelectorProps = {
  likable?: boolean;
  selected: CategoryT[];
  onSelect: (val: CategoryT) => void;
};


export function CategorySelector({
  likable,
  selected,
  onSelect,
}: CategorySelectorProps): ReactNode {
  const t = useTranslations("components.CategorySelector");
  const { downSm } = useResponsive();

  const { data: categories$, actions: categoriesAct } = useCategoriesStore();

  const { status, data: categories } = categories$;
  const me = useMe();
  const group = useGroup();

  const listOpt = getCategoriesListOpt({ userId: me?.id, groupId: group.id });

  useEffect(() => {
    categoriesAct.load(listOpt);
  }, []);

  function handleSelect(val: CategoryT): void {
    onSelect(val);
  }

  async function _likeCategory(categoryId: idT): Promise<void> {
    await XUserCategoryApi.create(categoryId);
    const { data: updated } = await CategoryApi.get(categoryId, { $my_like: true });
    categoriesAct.replaceItem(updated);
  }

  async function _unlikeCategory(categoryId: idT): Promise<void> {
    await XUserCategoryApi.remove(categoryId);
    const { data: updated } = await CategoryApi.get(categoryId, { $my_like: true });
    categoriesAct.replaceItem(updated);
  }

  async function handleLikeClick(e: MouseEvent<Element>, category: CategoryT): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (category.my_like) {
        await _unlikeCategory(category.id);
      } else {
        await _likeCategory(category.id);
      }
    } catch (e) {
      console.warn(e);
    }
  }


  function handleErrorRetry(): void {
    categoriesAct.load(listOpt, { force: true });
  }


  if (status === "init") {
    return <InitBox />;
  }
  if (status === "loading") {
    return <LoadingBox />;
  }
  if (status == "error") {
    return <ErrorBox onRetry={handleErrorRetry} />;
  }

  return (
    <Box
      width='100%'
      minHeight={60}
      display='flex'
      flexDirection='row'
      flexWrap='wrap'
      justifyContent='center'
    >
      {categories.length == 0 && (
        <Row>
          <CloseIcon sx={{ color: "vague.main" }}/>
          <Gap x={1}/>
          <Txt color='vague.main'>{t("noCategory")}</Txt>
        </Row>
      )}

      {categories.map((category) => {
        const idx = selected.findIndex((val) => val.id == category.id);
        const isSelected = idx >= 0;
        return (
          <Box
            key={category.id}
            m={1 / 4}
          >
            <CategoryItem
              category={category}
              likable={Boolean(me) && likable}
              selected={isSelected}
              size={downSm ? "small" : "medium"}
              onClick={(): void => handleSelect(category)}
              onLikeClick={(e): Promise<void> => handleLikeClick(e, category)}
            />
          </Box>
        );
      })}
    </Box>
  );
}
