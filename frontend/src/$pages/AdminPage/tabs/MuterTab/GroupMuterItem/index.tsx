"use client";

import React, { useState, MouseEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { IconButton, Menu, MenuItem, ListItemText, ListItemIcon } from "@mui/material";
import { MoreHorizIcon, DeleteIcon } from "@/ui/icons";
import { Col, Row, Gap } from "@/ui/layouts";
import { Avatar } from "@/ui/tools/Avatar";
import { Txt } from "@/ui/texts";
import { vizDate } from "@/utils/time";
import * as GroupMuterApi from "@/apis/group_muters";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import type { GroupMuterT } from "@/types";

type GroupMuterItemProps = {
  muter: GroupMuterT;
  onDeleted: (muter: GroupMuterT) => void;
};

export function GroupMuterItem({
  muter,
  onDeleted,
}: GroupMuterItemProps): JSX.Element {
  const t = useTranslations("pages.AdminPage.MuterTab.GroupMuterItem");
  const locale = useLocale();
  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();
  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);

  function handleMenuClose(): void {
    setMenuEl(null);
  }

  function handleMoreClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setMenuEl(e.currentTarget);
  }

  async function handleDeleteClick(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("deleteRestriction"),
      body: t("deleteRestrictionMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    try {
      const deleted = await GroupMuterApi.remove(muter.id);
      onDeleted(deleted);
      enqueueSnackbar(t("deleteRestrictionSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("deleteRestrictionFailed"), { variant: "error" });
    }
  }

  return (
    <>
      <Row>
        <Col minWidth={400}>
          <Row>
            <Avatar size={30}/>
            <Gap x={1}/>
            <Txt>({t("anonymousMember")})</Txt>
          </Row>
          <Gap y={1}/>
          <Txt variant="body3"><b>{t("reason")}:</b> {muter.reason}</Txt>
          <Txt variant="body3"><b>{t("duration")}:</b> {vizDate(muter.created_at, { type: "short", locale })} ~ {vizDate(muter.until, { type: "short", locale })}</Txt>
        </Col>

        <IconButton
          size='small'
          sx={{ alignSelf: "flex-start" }}
          onClick={handleMoreClick}
        >
          <MoreHorizIcon/>
        </IconButton>
      </Row>
      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon/>
          </ListItemIcon>
          <ListItemText>
            {t("delete")}
          </ListItemText>
        </MenuItem>

      </Menu>
    </>
  );
}