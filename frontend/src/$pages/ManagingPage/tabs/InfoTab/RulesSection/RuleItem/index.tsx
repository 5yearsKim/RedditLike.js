"use client";
import React, { Fragment } from "react";
import { useTranslations, useLocale } from "next-intl";
import { IconButton, Collapse } from "@mui/material";
import { Tooltip } from "@/ui/tools/Tooltip";
import { DeleteIcon, EditIcon, FoldIcon, UnfoldIcon } from "@/ui/icons";
import { Box, Row, Gap, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { RuleEditorDialog } from "../RuleEditorDialog";
import { vizTime } from "@/utils/time";

import { useState, MouseEvent } from "react";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import * as BoardRuleApi from "@/apis/board_rules";
import type { BoardRuleT, BoardRuleFormT } from "@/types";


type RuleItemProps = {
  idx?: number;
  rule: BoardRuleT;
  onUpdated: (rule: BoardRuleT) => void;
};

export function RuleItem({
  idx,
  rule,
  onUpdated,
}: RuleItemProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.InfoTab.RulesSection.RuleItem");
  const locale = useLocale();
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const { showAlertDialog } = useAlertDialog();

  function handlePreviewToggle(): void {
    setDetailOpen(!detailOpen);
  }

  function handleEditClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setEditorOpen(true);
  }

  async function handleEditorCancel(form: BoardRuleFormT): Promise<void> {
    if (form.alias != rule.alias || form.description != rule.description || form.title != rule.title) {
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
    setEditorOpen(false);
    // setEditorOp
  }

  async function handleEditorSave(form: BoardRuleFormT): Promise<void> {
    try {
      const updated = await BoardRuleApi.update(rule.id, form);
      onUpdated(updated);
      setEditorOpen(false);
    } catch (e) {
      console.warn(e);
    }
  }


  const details: { category: string; detail: string }[] = [
    { category: t("description"), detail: rule.description },
    {
      category: t("applyRange"),
      detail: rule.range == "comment" ? t("commentOnly") : rule.range == "post" ? t("postOnly") : t("postAndComment"),
    },
    { category: t("reportReason"), detail: rule.alias ?? "" },
    { category: t("createdAt"), detail: vizTime(rule.created_at, { type: "absolute", locale }) },
  ];

  return (
    <Fragment>
      <Box>
        {/* main item */}
        <Box
          onClick={handlePreviewToggle}
          sx={{ cursor: "pointer" }}
        >
          <Row>
            <Box
              width='50px'
              display='flex'
              justifyContent='center'
            >
              <Txt fontWeight={700}>{idx ?? "?"}.</Txt>
            </Box>
            <Expand>
              <Txt fontWeight={500}>{rule.title}</Txt>
            </Expand>
            <Tooltip title={t("edit")}>
              <IconButton onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("delete")}>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            {detailOpen ? <FoldIcon /> : <UnfoldIcon />}
          </Row>
        </Box>
        {/* detail */}
        <Collapse in={detailOpen}>
          <Box
            px={6}
            pb={1}
          >
            {details.map(({ category, detail } ) => {
              return (
                <Fragment key={category}>
                  <Row>
                    <Box
                      minWidth='100px'
                      display='flex'
                      justifyContent='flex-start'
                    >
                      <Txt variant='subtitle2'>{category}</Txt>
                    </Box>
                    <Gap x={1}/>
                    <Expand>
                      <Txt>{detail}</Txt>
                    </Expand>
                  </Row>
                </Fragment>
              );
            })}
          </Box>
        </Collapse>
      </Box>
      <RuleEditorDialog
        open={editorOpen}
        rule={rule}
        boardId={rule.board_id}
        nextRank={rule.rank ?? 0}
        onCancel={handleEditorCancel}
        onSave={handleEditorSave}
      />
    </Fragment>
  );
}
