import React from "react";
import { useTranslations } from "next-intl";
import { Dialog, TextField, Button, Box } from "@mui/material";
import { Row, Gap } from "@/ui/layouts";
// logic
import { useState, useEffect, MouseEvent, ChangeEvent } from "react";
import type { CategoryT, CategoryFormT } from "@/types";


type CategoryEditorDialogProps = {
  category?: CategoryT;
  open: boolean;
  onSave: (form: CategoryFormT) => any;
  onClose: (form: CategoryFormT) => any;
};

// eslint-disable-next-line
export function CategoryEditorDialog({
  category,
  open,
  onSave,
  onClose,
}: CategoryEditorDialogProps): JSX.Element {
  const t = useTranslations("pages.AdminPage.CategoryTab.CategorySection.CategoryEditorDialog");
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    if (open) {
      if (category) {
        setLabel(category.label);
      }
    }
  }, [open]);

  const form: CategoryFormT = {
    label: label,
  };

  function handleClose(): void {
    onClose(form);
  }

  function handleApplyClick(e: MouseEvent): void {
    e.preventDefault();
    onSave(form);
  }

  function handleLabelChange(e: ChangeEvent<HTMLInputElement>): void {
    setLabel(e.target.value);
  }


  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <Box p={2}>
        <TextField
          label={t("category")}
          autoComplete='off'
          value={label}
          onChange={handleLabelChange}
        />

        <Gap y={2} />

        <Row justifyContent='flex-end'>
          <Button onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button
            variant='contained'
            onClick={handleApplyClick}
          >
            {t("apply")}
          </Button>
        </Row>
      </Box>
    </Dialog>
  );
}
