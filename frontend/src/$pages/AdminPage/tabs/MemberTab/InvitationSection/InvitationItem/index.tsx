"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { MoreHorizIcon, CloseIcon } from "@/ui/icons";
import { Row, Box, Gap } from "@/ui/layouts";
import { Avatar } from "@/ui/tools/Avatar";
import { Txt } from "@/ui/texts";
import * as GroupInvitationApi from "@/apis/group_invitations";
import { useGroup } from "@/stores/GroupStore";
import { useSnackbar } from "@/hooks/Snackbar";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { GroupInvitationT } from "@/types";

type InvitationItemProps = {
  invitation: GroupInvitationT
  onDeleted: (invitation: GroupInvitationT) => void
}
export function InvitationItem({
  invitation,
  onDeleted,
}: InvitationItemProps): JSX.Element {
  const t = useTranslations("pages.AdminPage.MemberTab.InvitationSection.InvitationItem");
  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();
  const group = useGroup();

  const [menuEl, setMenuEl] = useState<null|HTMLElement>(null);

  function handleMenuClick(e: React.MouseEvent<HTMLElement>): void {
    setMenuEl(e.currentTarget);
  }

  async function handleDeleteClick(): Promise<void> {
    setMenuEl(null);
    const isOk = await showAlertDialog({
      title: t("cancelInvitation"),
      body: group.protection == "public" ? t("cancelInvitationPublicMsg") : t("cancelInvitationPrivateMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    try {
      const deleted = await GroupInvitationApi.remove(invitation.id);
      onDeleted(deleted);
      enqueueSnackbar(t("cancelInvitationSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("cancelInvitationFailed"), { variant: "error" });
    }
  }

  return (
    <>
      <Row my={1}>
        <Avatar size="20px"/>
        <Gap x={1}/>
        <Box minWidth={300}>
          <Txt variant="body2">{invitation.email}</Txt>
        </Box>
        <IconButton onClick={handleMenuClick}>
          <MoreHorizIcon/>
        </IconButton>
      </Row>
      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={() => setMenuEl(null)}
      >
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <CloseIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="초대 취소" />
        </MenuItem>
      </Menu>
    </>
  );

}