"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@mui/material";
import { CategoryEditorDialog } from "../CategoryEditorDialog";
import { AddIcon } from "@/ui/icons";
// logic
import { useState, MouseEvent } from "react";
import { useSnackbar } from "@/hooks/Snackbar";
import * as CategoryApi from "@/apis/categories";
import type { CategoryT, CategoryFormT } from "@/types";


type AddCategoryButtonProps = {
  onCreated: (created: CategoryT) => any;
};


export function AddCategoryButton({
  onCreated,
}: AddCategoryButtonProps): JSX.Element {
  const t = useTranslations("pages.AdminPage.CategoryTab.CategorySection.AddCategoryButton");
  const { enqueueSnackbar } = useSnackbar();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  function handleButtonClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setEditorOpen(true);
  }

  function handleEditorClose(): void {
    setEditorOpen(false);
  }

  async function handleEditorSave(form: CategoryFormT): Promise<void> {
    try {
      const created = await CategoryApi.create(form);
      onCreated(created);
      setEditorOpen(false);
      enqueueSnackbar(t("addSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("addFailed"), { variant: "error" });
    }
  }

  return (
    <Fragment>
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={handleButtonClick}
      >
        {t("add")}
      </Button>
      {editorOpen && (
        <CategoryEditorDialog
          open={editorOpen}
          onClose={handleEditorClose}
          onSave={handleEditorSave}
        />
      )}
    </Fragment>
  );
}
