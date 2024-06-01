"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button, Dialog, IconButton } from "@mui/material";
import { Tooltip } from "@/ui/tools/Tooltip";
import { CloseIcon, AddIcon } from "@/ui/icons";
import { Box, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardUserLookup } from "@/components/BoardUserLookup";
import { BoardAuthor } from "@/components/BoardAuthor";
// logic
import { useState, useEffect, MouseEvent } from "react";
import { useSnackbar } from "@/hooks/Snackbar";
import * as BoardManagerApi from "@/apis/board_managers";
import type { BoardManagerFormT, BoardManagerT, BoardUserT } from "@/types";


export type AddManagerButtonProps = {
  boardId: idT;
  onCreated: (newManager: BoardManagerT) => void;
};

export function AddManagerButton({
  boardId,
  onCreated,
}: AddManagerButtonProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ManagerTab.AddManagerButton");
  const { enqueueSnackbar } = useSnackbar();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<BoardUserT | undefined>();

  const submitDisable = !selected;

  useEffect(() => {
    // when close -> reset
    if (!isOpen) {
      setSelected(undefined);
    }
  }, [isOpen]);

  function handleButtonClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  }

  function handleDialogClose(): void {
    setIsOpen(false);
  }

  function handleBoardUserSelect(boardUser: BoardUserT): void {
    setSelected(boardUser);
  }

  function handleDeleteBoardUserClick(): void {
    setSelected(undefined);
  }

  async function handleSubmit(): Promise<void> {
    if (!selected) {
      return;
    }
    try {
      const managerForm: BoardManagerFormT = {
        user_id: selected.user_id,
        board_id: selected.board_id,
        is_super: false,
      };
      const created = await BoardManagerApi.create(managerForm);
      const { data: newManager } = await BoardManagerApi.get(created.id, { $author: true });
      onCreated(newManager);
      enqueueSnackbar( t("addManagerSuccess"), { variant: "success" });
      setIsOpen(false);
    } catch (e) {
      console.warn(e);
      enqueueSnackbar( t("addManagerFailed"), { variant: "error" });
    }
  }

  return (
    <Fragment>
      <Button
        variant='contained'
        onClick={handleButtonClick}
        startIcon={<AddIcon />}
      >
        {t("addManager")}
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleDialogClose}
      >
        <Box
          px={2}
          py={2}
          width='300px'
        >
          <Txt variant='h6'>{t("addManager")}</Txt>

          <Gap y={1} />

          <Txt color='vague.main'>{t("addManagerHelper")}</Txt>
          <Gap y={2} />

          {selected ? (
            <Row justifyContent='center'>
              <BoardAuthor author={selected.author ?? null} />
              <Gap x={1} />
              <Tooltip title={t("cancel")}>
                <IconButton onClick={handleDeleteBoardUserClick}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Row>
          ) : (
            <BoardUserLookup
              boardId={boardId}
              onSelect={handleBoardUserSelect}
            />
          )}

          <Gap y={2} />

          <Row justifyContent='flex-end'>
            <Button onClick={handleDialogClose}>{t("cancel")}</Button>
            <Button
              variant='contained'
              disabled={submitDisable}
              onClick={handleSubmit}
            >
              {t("register")}
            </Button>
          </Row>
        </Box>
      </Dialog>
    </Fragment>
  );
}
