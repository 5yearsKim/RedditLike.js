"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@mui/material";
import { AddIcon } from "@/ui/icons";
import { RuleEditorDialog } from "../RuleEditorDialog";
// logic
import { useState, MouseEvent, useRef } from "react";
import * as BoardRuleApi from "@/apis/board_rules";
import { RuleEditorDialogT } from "../RuleEditorDialog";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import type { BoardRuleT, BoardRuleFormT } from "@/types";

type RuleAddButtonProps = {
  boardId: idT;
  nextRank: number;
  size?: "small" | "medium" | "large";
  onAdded: (rule: BoardRuleT) => any;
};

export function RuleAddButton({
  boardId,
  nextRank,
  size = "medium",
  onAdded,
}: RuleAddButtonProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.InfoTab.RulesSection.RuleAddButton");

  const { showAlertDialog } = useAlertDialog();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const editorRef = useRef<RuleEditorDialogT | null>(null);

  function handleButtonClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setEditorOpen(true);
  }

  async function handleEditorSave(form: BoardRuleFormT): Promise<void> {
    try {
      const created = await BoardRuleApi.create(form);
      await onAdded(created);
      setEditorOpen(false);
      editorRef.current?.reset();
    } catch (e) {
      console.warn(e);
    }
  }

  async function handleEditorCancel(form: BoardRuleFormT): Promise<void> {
    if (form.title || form.description) {
      const isOk = await showAlertDialog({
        title: t("cancelRule"),
        body: t("cancelRuleMsg"),
        useOk: true,
        useCancel: true,
      });
      if (!isOk) {
        return;
      }
    }
    editorRef.current?.reset();
    setEditorOpen(false);
  }

  return (
    <Fragment>
      <Button
        variant='contained'
        onClick={handleButtonClick}
        startIcon={<AddIcon />}
        size={size}
      >
        {t("addRule")}
      </Button>
      <RuleEditorDialog
        ref={editorRef}
        boardId={boardId}
        nextRank={nextRank}
        open={editorOpen}
        onSave={handleEditorSave}
        onCancel={handleEditorCancel}
      />
    </Fragment>
  );
}
