"use client";
import React, { forwardRef } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  TextField,
  Checkbox,
  Dialog,
  List,
  ListItemButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Box, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
// logic
import { useState, ChangeEvent, useImperativeHandle } from "react";
import { useTextForm } from "@/hooks/TextForm";
import { noEmptyValidator, maxLenValidator, charRemainingHelper } from "@/utils/validator";
import { BoardRuleT, BoardRuleFormT, BoardRuleRangeT } from "@/types";


export type RuleEditorDialogT = {
  reset: () => void;
};

type RuleEditorDialogProps = {
  open: boolean;
  boardId: idT;
  nextRank: number;
  rule?: BoardRuleT;
  onSave: (rule: BoardRuleFormT) => void;
  onCancel: (rule: BoardRuleFormT) => void;
};


export const RuleEditorDialog = forwardRef<RuleEditorDialogT, RuleEditorDialogProps>(
  (props: RuleEditorDialogProps, ref): JSX.Element => {
    const t = useTranslations("pages.ManagingPage.InfoTab.RulesSection.RuleEditorDialog");

    const { open, boardId, nextRank, rule: preRule, onSave, onCancel } = props;

    const {
      val: title,
      setVal: setTitle,
      isValid: isTitleValid,
      errText: titleErrText,
      helpText: titleHelpText,
    } = useTextForm(preRule?.title ?? "", {
      validators: [noEmptyValidator(), maxLenValidator(80)],
      helpers: [charRemainingHelper(80)],
    });

    const {
      val: description,
      setVal: setDescription,
      isValid: isDescriptionValid,
      errText: descriptionErrText,
      helpText: descriptionHelpText,
    } = useTextForm(preRule?.description ?? "", {
      validators: [noEmptyValidator(), maxLenValidator(200)],
      helpers: [charRemainingHelper(200)],
    });

    const {
      val: alias,
      setVal: setAlias,
      // isValid: isAliasValid,
      // errText: aliasErrText,
      helpText: aliasHelpText,
    } = useTextForm(preRule?.alias ?? "", {
      helpers: [
        (text: string): string | null => (text.length ? null : t("titleIfEmpty")),
      ],
    });

    const [range, setRange] = useState<BoardRuleRangeT>(preRule?.range ?? "all");

    const submitDisable = !isTitleValid || !isDescriptionValid;

    useImperativeHandle(ref, () => ({
      reset: (): void => {
        setTitle("");
        setDescription("");
        setAlias("");
        setRange("all");
      },
    }));

    function handleTitleChange(e: ChangeEvent<HTMLInputElement>): void {
      setTitle(e.target.value);
    }

    function handleDescriptionChange(e: ChangeEvent<HTMLInputElement>): void {
      setDescription(e.target.value);
    }

    function handleAliasChange(e: ChangeEvent<HTMLInputElement>): void {
      setAlias(e.target.value);
    }

    function handleRangeChange(val: BoardRuleRangeT): void {
      setRange(val);
    }

    const ruleForm: BoardRuleFormT = {
      board_id: boardId,
      title: title,
      description: description,
      alias: alias.length ? alias : undefined,
      range: range,
      rank: preRule?.rank ?? nextRank,
    };

    function handleCancel(): void {
      onCancel(ruleForm);
    }

    function handleSave(): void {
      onSave(ruleForm);
    }


    return (
      <Dialog
        open={open}
        onClose={handleCancel}
      >
        <Box
          display='flex'
          flexDirection='column'
          p={4}
          minWidth='290px'
        >
          <TextField
            label={t("ruleTitle")}
            placeholder={t("ruleNameHelper")}
            value={title}
            error={Boolean(titleErrText)}
            autoComplete='off'
            helperText={titleErrText ?? titleHelpText}
            onChange={handleTitleChange}
          />

          <Gap y={1} />

          <TextField
            label={t("description")}
            placeholder={t("descriptionHelper")}
            multiline
            autoComplete='off'
            minRows={2}
            maxRows={6}
            value={description}
            error={Boolean(descriptionErrText)}
            helperText={descriptionErrText ?? descriptionHelpText}
            onChange={handleDescriptionChange}
          />

          <Gap y={2} />

          <Txt
            fontWeight={500}
            ml={2}
          >
            {t("applyRange")}
          </Txt>
          <List>
            {[
              { label: t("postAndComment"), val: "all" },
              { label: t("postOnly"), val: "post" },
              { label: t("commentOnly"), val: "comment" },
            ].map((item) => {
              const { label, val } = item;
              return (
                <ListItem
                  key={item.val}
                  dense
                  sx={{ m: 0 }}
                  disableGutters
                  disablePadding
                >
                  <ListItemButton onClick={(): void => handleRangeChange(val as BoardRuleRangeT)}>
                    <ListItemIcon>
                      <Checkbox checked={range == val} />
                    </ListItemIcon>
                    <ListItemText>{label}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <TextField
            label={t("reportReason")}
            placeholder={t("reportReasonHelper")}
            value={alias}
            autoComplete='off'
            helperText={aliasHelpText}
            onChange={handleAliasChange}
          />

          <Gap y={1} />

          <Row justifyContent='flex-end'>
            <Button onClick={handleCancel}>
              {t("cancel")}
            </Button>
            <Button
              disabled={submitDisable}
              onClick={handleSave}
              variant='contained'
            >
              {preRule ? t("edit") : t("apply")}
            </Button>
          </Row>
        </Box>
      </Dialog>
    );
  },
);
