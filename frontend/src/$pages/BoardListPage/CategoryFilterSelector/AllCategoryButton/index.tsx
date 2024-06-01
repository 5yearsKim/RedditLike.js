"use client";
import React, { useState, useEffect, Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Dialog, Button, Chip } from "@mui/material";
import { AddIcon } from "@/ui/icons";
import { Row, Gap, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CategorySelector } from "@/components/CategorySelector";
import { CategoryT } from "@/types/Category";
import { useUrlState } from "@/hooks/UrlState";

type AllCategoryButtonProps = {
  categories?: CategoryT[];
  size?: "small" | "medium";
  onUpdate: (categories: CategoryT[]) => void;
};


export function AllCategoryButton({
  categories,
  size,
  onUpdate,
}: AllCategoryButtonProps): ReactNode {
  const t = useTranslations("pages.BoardListPage.CategoryFilterSelector.AllCategoryButton");

  const [selected, setSelected] = useState<CategoryT[]>([]);
  // const [selectorOpen, setSelectorOpen] = useState<boolean>(false);
  const [selectorOpen, setSelectorOpen] = useUrlState<boolean>({
    key: "categorySelector",
    val2query: (val) => val ? "true" : null,
    query2val: (query) => query == "true",
    backOn: (val) => !val,
  });

  useEffect(() => {
    setSelected(categories ?? []);
  }, [categories]);

  function handleSelectorOpen(): void {
    setSelectorOpen(true);
  }

  function handleSelectorClose(): void {
    setSelected(categories ?? []);
    setSelectorOpen(false);
  }

  function handleCategorySelect(val: CategoryT): void {
    const idx = selected.findIndex((item) => item.id == val.id);
    if (idx < 0) {
      setSelected([...selected, val]);
    } else {
      const newSelected = [...selected];
      newSelected.splice(idx, 1);
      setSelected(newSelected);
    }
  }

  async function handleSelectorSubmit(): Promise<void> {
    onUpdate(selected);
    setSelectorOpen(false);
  }


  return (
    <Fragment>
      <Chip
        icon={<AddIcon />}
        label={t("showMore")}
        size={size}
        onClick={handleSelectorOpen}
        sx={{
          mx: 0.5,
          py: size == "small" ? 1.8 : undefined,
          cursor: "pointer",
          borderRadius: 2,
        }}
      />
      <Dialog
        open={selectorOpen}
        maxWidth='sm'
        onClose={handleSelectorClose}
      >
        <Box p={2}>
          <Txt variant='h6'>{t("selectCategory")}</Txt>

          <Gap y={1} />

          <CategorySelector
            likable
            selected={selected}
            onSelect={handleCategorySelect}
          />

          <Gap y={1} />

          <Row justifyContent='flex-end'>
            <Button
              onClick={handleSelectorClose}
            >
              {t("cancel")}
            </Button>
            <Button
              variant='contained'
              onClick={handleSelectorSubmit}
            >
              {t("apply")}
            </Button>
          </Row>
        </Box>
      </Dialog>
    </Fragment>
  );
}
