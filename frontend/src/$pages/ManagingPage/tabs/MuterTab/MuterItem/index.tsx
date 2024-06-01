"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { IconButton } from "@mui/material";
import { Tooltip } from "@/ui/tools/Tooltip";
import { BoardAuthor } from "@/components/BoardAuthor";
import { AuthorFingerprint } from "@/components/AuthorFingerprint";
import { Row, Col, Box, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EditIcon, DeleteIcon } from "@/ui/icons";
import { vizDate } from "@/utils/time";
// logic
import { MouseEvent } from "react";
import { useBlockAuthorDialog } from "@/hooks/dialogs/BlockAuthorDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useMe } from "@/stores/UserStore";
import * as BoardMuterApi from "@/apis/board_muters";
import type { BoardMuterT } from "@/types";

type MuterItemProps = {
  muter: BoardMuterT;
  onDeleted: (muter: BoardMuterT) => any;
};

export function MuterItem({
  muter,
  onDeleted,
}: MuterItemProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.MuterTab.MuterItem");
  const locale = useLocale();
  const { openBlockAuthorDialog } = useBlockAuthorDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();
  const me = useMe();

  function handleEditClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    openBlockAuthorDialog("board", muter.author!, {
      reason: muter.reason ?? "",
      until: new Date(muter.until!),
    });
  }

  async function handleDeleteClick(e: MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    const isOk = await showAlertDialog({
      title: t("deleteRestriction"),
      body: t("deleteRestrictionMsg"),
      useOk: true,
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await BoardMuterApi.remove(muter.id);
      enqueueSnackbar(t("deleteRestrictionSuccess"), { variant: "success" });
      onDeleted(muter);
    } catch (e) {
      console.warn(e);
      enqueueSnackbar( t("deleteRestrictionFailed"), { variant: "error" });
    }
  }

  const author = muter.author;

  return (
    <Col width='100%'>
      <Row>
        <BoardAuthor
          author={author ?? null}
          renderInfo={(): JSX.Element => (
            <AuthorFingerprint
              isMe={Boolean(me) && me?.id == author?.id}
              isManager={author?.is_manager}
            />
          )}
        />
        <Expand />
        <Txt
          variant='body3'
          color='vague.main'
        >
          {vizDate(muter.created_at, { type: "short", locale })} ~ {vizDate(muter.until, { type: "short", locale })}
        </Txt>

        <Tooltip title={t("edit")}>
          <IconButton onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("delete")}>
          <IconButton onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Row>
      <Box mt={0.5} />
      <Txt
        variant='body3'
        fontWeight={500}
      >
        {t("reason")}: {muter.reason}
      </Txt>
    </Col>
  );
}
