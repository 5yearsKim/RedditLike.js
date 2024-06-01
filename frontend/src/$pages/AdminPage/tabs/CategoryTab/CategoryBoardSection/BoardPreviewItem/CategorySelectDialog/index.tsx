import React from "react";
import { useTranslations } from "next-intl";
import { Dialog, Box, Button } from "@mui/material";
import { Row, Col, Gap } from "@/ui/layouts";
import { CategoryItem } from "@/components/CategoryItem";
// logic
import { useState } from "react";
import { useCategoriesStore } from "@/stores/CategoriesStore";
import type { CategoryT } from "@/types";


type CategorySelectDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (categories: CategoryT[]) => void;
};

export function CategorySelectDialog({
  open,
  onClose,
  onSelect,
}: CategorySelectDialogProps): JSX.Element {
  const t = useTranslations("pages.AdminPage.CategoryTab.CategoryBoardSection.BoardPreviewItem.CategorySelectDialog");

  const { data: categories$ } = useCategoriesStore();
  const { data: categories } = categories$;
  const [selected, setSelected] = useState<CategoryT[]>([]);

  const submitDisable = selected.length == 0;

  function handleCategoryClick(category: CategoryT): void {
    const idx = selected.findIndex((item) => item.id == category.id);
    if (idx >= 0) {
      const newSelected = [...selected];
      newSelected.splice(idx, 1);
      setSelected(newSelected);
    } else {
      setSelected([...selected, category]);
    }
  }

  function handleCancelClick(): void {
    setSelected([]);
    onClose();
  }

  function handleClose(): void {
    onClose();
  }

  function handleSubmit(): void {
    if (!selected) {
      return;
    }
    onClose();
    onSelect(selected);
    setSelected([]);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
    >
      <Col py={1} px={2}>
        <Row
          flexWrap='wrap'
          columnGap={0.5}
          rowGap={0.5}
        >
          {categories.map((category) => {
            return (
              <Box key={category.id}>
                <CategoryItem
                  category={category}
                  selected={selected.some((item) => item.id == category.id)}
                  onClick={(): void => handleCategoryClick(category)}
                />
              </Box>
            );
          })}
        </Row>

        <Gap y={2} />

        <Row justifyContent='flex-end'>
          <Button onClick={handleCancelClick}>{t("cancel")}</Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={submitDisable}
          >
            {t("apply")}
          </Button>
        </Row>
      </Col>
    </Dialog>
  );
}
