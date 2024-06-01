"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Dialog, Button, IconButton, CircularProgress } from "@mui/material";
import { RetryIcon, AddIcon } from "@/ui/icons";
import { Row, Gap, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CategoryItem } from "@/components/CategoryItem";
import { CategorySelector } from "@/components/CategorySelector";
// logic
import { useEffect, useState } from "react";
import * as CategoryApi from "@/apis/categories";
import * as XBoardCategoryApi from "@/apis/x_board_category";
import { useSnackbar } from "@/hooks/Snackbar";
import type { BoardT, CategoryT } from "@/types";

type CategorySelectSectionProps = {
  board: BoardT;
};

export function CategorySelectSection({ board }: CategorySelectSectionProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.EtcTab.CategorySelectSection");
  const { enqueueSnackbar } = useSnackbar();
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<ProcessStatusT>("init");
  const [categories, setCategories] = useState<CategoryT[]>([]);

  const [categorySelected, setCategorySelected] = useState<CategoryT[]>([]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setCategorySelected([...categories]);
  }, [categories]);

  async function init(): Promise<void> {
    try {
      setStatus("loading");
      const { data: fetched } = await CategoryApi.list({ boardId: board.id });
      setCategories(fetched);
      setStatus("loaded");
    } catch (e) {
      setStatus("error");
    }
  }

  function handleErrorRetry(): void {
    init();
  }

  function handleSelectorOpen(): void {
    setSelectorOpen(true);
  }

  function handleSelectorClose(): void {
    setCategorySelected([...categories]);
    setSelectorOpen(false);
  }

  function handleCategorySelect(val: CategoryT): void {
    const idx = categorySelected.findIndex((category) => category.id == val.id);
    if (idx < 0) {
      setCategorySelected([val]);
    } else {
      setCategorySelected([]);
    }
  }

  async function handleSelectorSubmit(): Promise<void> {
    try {
      const categoryIds = categorySelected.map((category) => category.id);
      await XBoardCategoryApi.link(board.id, categoryIds);
      const { data: fetched } = await CategoryApi.list({ boardId: board.id });
      setCategories(fetched);
      setSelectorOpen(false);
      enqueueSnackbar(t("categoryUpdateSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("categoryUpdateFailed"), { variant: "error" });
    }
  }


  if (status == "init") {
    return <Box />;
  }
  if (status == "loading") {
    return <CircularProgress />;
  }
  if (status == "error") {
    return (
      <IconButton
        color='error'
        onClick={handleErrorRetry}
      >
        <RetryIcon />
      </IconButton>
    );
  }
  return (
    <Fragment>
      {categories.length == 0 ? (
        <Button
          startIcon={<AddIcon />}
          onClick={handleSelectorOpen}
        >
          {t("categorySetting")}
        </Button>
      ) : (
        <Box onClick={handleSelectorOpen}>
          {categories.map((category) => {
            return (
              <Fragment key={`category-${category.id}`}>
                <CategoryItem
                  category={category}
                  selected={true}
                  onClick={(): void => {} }
                />
              </Fragment>
            );
          })}
        </Box>
      )}
      <Dialog
        open={selectorOpen}
        fullWidth
        onClose={handleSelectorClose}
      >
        <Box p={2}>
          <Txt variant='h6'>{t("selectCategory")}</Txt>

          <Gap y={1} />

          <CategorySelector
            selected={categorySelected}
            onSelect={handleCategorySelect}
          />

          <Gap y={1} />

          <Row justifyContent='flex-end'>
            <Button onClick={handleSelectorClose}>{t("cancel")}</Button>
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
