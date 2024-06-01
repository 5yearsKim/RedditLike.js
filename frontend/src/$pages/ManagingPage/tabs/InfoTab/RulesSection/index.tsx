"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button, Paper, Divider } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { Row, Col, Box, Gap, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ReorderableList } from "@/ui/tools/ReorderableList";
import { ReorderIcon } from "@/ui/icons";
import { RuleItem } from "./RuleItem";
import { RuleAddButton } from "./RuleAddButton";

import { useState } from "react";
import * as BoardRuleApi from "@/apis/board_rules";
import { useSnackbar } from "@/hooks/Snackbar";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import { replaceItem } from "@/utils/misc";
import type { BoardRuleT } from "@/types";


export function RulesSection(): JSX.Element {
  const t = useTranslations("pages.ManagingPage.InfoTab.RulesSection");
  const { enqueueSnackbar } = useSnackbar();

  const boardMainAct = useBoardMainActions();
  const boardMain$ = useBoardMain$();
  const { board, rules } = boardMain$.data!;

  const [isReorder, setIsReorder] = useState<boolean>(false);
  const [reorderedRules, setReorderedRules] = useState<BoardRuleT[]>([]);


  const reorderDisable = !rules || rules.length < 2;
  const reorderApplyDisable = rules == reorderedRules;


  function handleReorderButtonClick(): void {
    if (!rules) {
      return;
    }
    setReorderedRules(rules);
    setIsReorder(true);
  }

  async function handleRuleAdded(newRule: BoardRuleT): Promise<void> {
    if (!rules) {
      return;
    }
    boardMainAct.patchData({ rules: [...rules, newRule] });
    enqueueSnackbar(t("ruleAdded"), { variant: "success" });
  }

  function handleRuleUpdated(newRule: BoardRuleT): void {
    if (!rules) {
      return;
    }
    const newRules = replaceItem(rules, newRule, (item) => item.id == newRule.id);
    boardMainAct.patchData({ rules: newRules });
    enqueueSnackbar(t("ruleEdited"), { variant: "success" });
  }

  function handleReorder(newItems: BoardRuleT[]): void {
    setReorderedRules(newItems);
  }

  function handleReorderCancelClick(): void {
    setIsReorder(false);
  }

  async function handleReorderSubmitClick(): Promise<void> {
    if (!reorderedRules) {
      return;
    }
    try {
      const ruleIds = reorderedRules.map((rule) => rule.id);
      await BoardRuleApi.rerank(board.id, ruleIds);
      const newRules = (await BoardRuleApi.list({ boardId: board.id })).data;
      boardMainAct.patchData({ rules: newRules });
      setIsReorder(false);
      enqueueSnackbar(t("reorderSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar( t("reorderFailed"), { variant: "error" });
    }
  }

  const { downSm } = useResponsive();

  return (
    <>
      <Row>
        <Txt variant='h6'>{t("boardRule")}</Txt>
        <Expand />
        {isReorder ? (
          // reorder action
          <Row>
            <Button
              onClick={handleReorderCancelClick}
              size={downSm ? "small" : "medium"}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleReorderSubmitClick}
              disabled={reorderApplyDisable}
              variant='contained'
              size={downSm ? "small" : "medium"}
            >
              {t("apply")}
            </Button>
          </Row>
        ) : (
          // normal actions
          <Row>
            <Button
              variant='outlined'
              onClick={handleReorderButtonClick}
              disabled={reorderDisable}
              startIcon={<ReorderIcon />}
              size={downSm ? "small" : "medium"}
            >
              {t("reorder")}
            </Button>
            <Box mr={{ xs: 0.5, sm: 1 }} />
            <RuleAddButton
              boardId={board.id}
              nextRank={rules.length}
              onAdded={handleRuleAdded}
              size={downSm ? "small" : "medium"}
            />
          </Row>
        )}
      </Row>

      <Gap y={1} />

      <Divider />

      <Gap y={1} />

      <Box>
        {isReorder ? (
          <ReorderableList
            onReorder={handleReorder}
            items={reorderedRules}
            renderItem={(item, idx): JSX.Element => {
              return (
                <Box
                  key={item.id}
                  mt={0.5}
                  mb={0.5}
                  sx={{ cursor: "pointer" }}
                >
                  <Paper sx={{ border: "2px dotted #aaaaaa " }}>
                    <RuleItem
                      rule={item}
                      idx={idx}
                      onUpdated={handleRuleUpdated}
                    />
                  </Paper>
                </Box>
              );
            }}
          />
        ) : (
          <Col>
            {rules.length == 0 && <Txt color='vague.main'>{t("noRule")}</Txt>}
            {rules.map((rule, idx) => {
              return (
                <Box
                  key={rule.id}
                  mt={0.5}
                  mb={0.5}
                  sx={{ cursor: "pointer" }}
                >
                  <Paper>
                    <RuleItem
                      key={rule.id}
                      rule={rule}
                      idx={idx}
                      onUpdated={handleRuleUpdated}
                    />
                  </Paper>
                </Box>
              );
            })}
          </Col>
        )}
      </Box>
    </>
  );
}
