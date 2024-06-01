"use client";
import React, { useState, useEffect, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Box, Col, Row } from "@/ui/layouts";
import { ReorderableGrid } from "@/ui/tools/ReorderableGrid";
import { EditIcon, DeleteIcon, ReorderIcon } from "@/ui/icons";
import { Menu, MenuItem, ListItemIcon, ListItemText, Button } from "@mui/material";
import { CategoryItem } from "@/components/CategoryItem";
import { LoadingIndicator, ErrorButton } from "@/components/$statusTools";
import { AddCategoryButton } from "./AddCategoryButton";
import { CategoryEditorDialog } from "./CategoryEditorDialog";
// logic
import { useMe } from "@/stores/UserStore";
import { useGroup } from "@/stores/GroupStore";
import { useCategoriesStore, getCategoriesListOpt } from "@/stores/CategoriesStore";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { useResponsive } from "@/hooks/Responsive";
import * as CategoryApi from "@/apis/categories";
import type { CategoryT, CategoryFormT } from "@/types";


export function CategorySection() {
  const t = useTranslations("pages.AdminPage.CategoryTab.CategorySection");

  const [selectedCategory, setSelectedCategory] = useState<CategoryT | null>(null);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
  const [reorderedCategories, setReorderedCategories] = useState<CategoryT[]>([]);

  const me = useMe();
  const group = useGroup();
  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { downSm } = useResponsive();

  const { data: categories$, actions: categoriesAct } = useCategoriesStore();

  const listOpt = getCategoriesListOpt({ userId: me?.id, groupId: group.id } );
  useEffect(() => {
    categoriesAct.load(listOpt);
  }, [me?.id]);

  function handleErrorRetry(): void {
    categoriesAct.load(listOpt, { force: true });
  }

  function handleCategoryClick(e: MouseEvent<HTMLElement>, category: CategoryT): void {
    setMenuEl(e.currentTarget);
    setSelectedCategory(category);
  }

  function handleMenuClose(): void {
    setMenuEl(null);
    setSelectedCategory(null);
  }

  function handleReorderButtonClick(): void {
    setIsReorderMode(true);
    setReorderedCategories(categories$.data);
  }

  function handleReorder(newCategories: CategoryT[]): void {
    setReorderedCategories(newCategories);
  }

  function handleReorderCancel(): void {
    setIsReorderMode(false);
  }

  async function handleReorderApply(): Promise<void> {
    try {
      const newCategories = await CategoryApi.rerank(group.id, reorderedCategories.map((item) => item.id));
      categoriesAct.patch({ data: newCategories });
      setIsReorderMode(false);
      enqueueSnackbar(t("reorderSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("reorderFailed"), { variant: "error" });
    }
  }

  async function handleCategoryDeleteClick(): Promise<void> {
    if (!selectedCategory) {
      return;
    }
    handleMenuClose();
    const isOk = await showAlertDialog({
      title: t("deleteCategory"),
      body: t("deleteCategoryMsg"),
      useOk: true,
      useCancel: true,
      themeDisabled: true,
    });
    if (isOk !== true) {
      return;
    }
    try {
      const deleted = await CategoryApi.remove(selectedCategory.id);
      categoriesAct.filterItems((item) => item.id !== deleted.id);
      enqueueSnackbar(t("deleteCategorySuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("deleteCategoryFailed"), { variant: "error" });
    }
  }

  function handleCategoryEditClick(): void {
    if (!selectedCategory) {
      return;
    }
    setEditorOpen(true);
  }


  function handleCategoryCreated(created: CategoryT): void {
    if (categories$.status !== "loaded") {
      return;
    }
    categoriesAct.patch({ data: [...categories$.data, created] });
  }

  function handleCategoryEditorClose(): void {
    setEditorOpen(false);
    handleMenuClose();
  }

  async function handleCategoryEditorSave(form: CategoryFormT): Promise<void> {
    if (!selectedCategory) {
      return;
    }
    try {
      const updated = await CategoryApi.update( selectedCategory.id, form);
      enqueueSnackbar(t("updateCategorySuccess"), { variant: "success" });
      categoriesAct.replaceItem({ ...selectedCategory, ...updated });
      setEditorOpen(false);
      handleMenuClose();
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("updateCategoryFailed"), { variant: "error" });
    }
  }


  const { data: categories, status } = categories$;

  if (status === "init" || status == "loading") {
    return <LoadingIndicator width={"100%"}/>;
  }
  if (status === "error") {
    return <ErrorButton onRetry={handleErrorRetry}/>;
  }


  if (isReorderMode) {
    return (
      <Col>
        <Row justifyContent='flex-end'>
          <Button onClick={handleReorderCancel}>
            {t("cancel")}
          </Button>
          <Button variant='contained' onClick={handleReorderApply}>
            {t("apply")}
          </Button>
        </Row>

        <ReorderableGrid
          items={reorderedCategories}
          columns={downSm ? 6 : 10}
          renderItem={(category): JSX.Element => {
            return (
              <Box m={0.2}>
                <CategoryItem
                  key={category.id}
                  category={category}
                  selected={false}
                  onClick={(): void => {}}
                />
              </Box>
            );
          }}
          onReorder={handleReorder}
        />
      </Col>
    );
  }

  return (
    <>
      <Row justifyContent='flex-end'>
        <Button
          startIcon={<ReorderIcon/>}
          onClick={handleReorderButtonClick}
        >
          {t("reorder")}
        </Button>

        <AddCategoryButton onCreated={handleCategoryCreated}/>

      </Row>
      <Row
        display='flex'
        flexWrap='wrap'
        columnGap={1}
        rowGap={1}
      >
        {categories.map((category) => {
          return (
            <CategoryItem
              key={category.id}
              category={category}
              selected={selectedCategory?.id == category.id}
              onClick={(e) => handleCategoryClick(e, category)}
            />
          );
        })}
      </Row>


      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleCategoryEditClick}>
          <ListItemIcon><EditIcon/></ListItemIcon>
          <ListItemText>{t("edit")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCategoryDeleteClick}>
          <ListItemIcon><DeleteIcon/></ListItemIcon>
          <ListItemText>{t("delete")}</ListItemText>
        </MenuItem>
      </Menu>
      {selectedCategory && (
        <CategoryEditorDialog
          category={selectedCategory}
          open={editorOpen}
          onClose={handleCategoryEditorClose}
          onSave={handleCategoryEditorSave}
        />
      )
      }
    </>
  );
}