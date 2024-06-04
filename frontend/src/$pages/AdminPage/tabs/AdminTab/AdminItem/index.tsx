"use client";
import React, { useState, ChangeEvent, Fragment } from "react";
import { useTranslations } from "next-intl";
import {
  IconButton, Dialog, FormGroup, FormControlLabel, Checkbox,
  Button,
} from "@mui/material";
import { Col, Row, Gap, Box } from "@/ui/layouts";
import { EditIcon, DeleteIcon } from "@/ui/icons";
import { Txt } from "@/ui/texts";
import { Tooltip } from "@/ui/tools/Tooltip";
import { useMe } from "@/stores/UserStore";
import { useSnackbar } from "@/hooks/Snackbar";
import * as AdminApi from "@/apis/admins";
import type { AdminT } from "@/types";


type AdminItemProps = {
  admin: AdminT
  onDeleted: (deleted: AdminT) => void
  onUpdated: (updated: AdminT) => void
}

export function AdminItem({
  admin,
  onDeleted,
  onUpdated,
}: AdminItemProps) {
  const t = useTranslations("pages.AdminPage.AdminTab.GroupAdminItem");

  const ADMIN_RIGHTS = [
    { label: t("manageIntro"), right: "manage_intro" },
    { label: t("manageAdmin"), right: "manage_admin" },
    { label: t("manageMember"), right: "manage_member" },
    { label: t("manageCategory"), right: "manage_category" },
    { label: t("manageCensor"), right: "manage_censor" },
    { label: t("manageMuter"), right: "manage_muter" },
  ] satisfies ({label: string, right :keyof AdminT})[];

  const [editingAdmin, setEditingAdmin] = useState<AdminT|null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const me = useMe();

  async function handleAdminDeleteClick(): Promise<void> {
    const isOk = confirm(t("deleteConfirmMsg"));
    if (!isOk) {
      return;
    }
    try {
      const deleted = await AdminApi.remove(admin.id);
      enqueueSnackbar( t("deleteSuccess"), { variant: "success" });
      onDeleted(deleted);
    } catch (e) {
      console.warn(e);
      enqueueSnackbar( t("deleteFailed"), { variant: "error" });
    }
  }

  function handleAdminEditClick(): void {
    setEditingAdmin(admin);
  }

  function handleEditorClose(): void {
    setEditingAdmin(null);
  }


  function handleEditingAdminRightChange(e: ChangeEvent<HTMLInputElement>, right: keyof AdminT): void {
    if (!editingAdmin) {
      return;
    }
    const checked = e.target.checked;
    setEditingAdmin({ ...editingAdmin, [right]: checked });
  }


  async function handleEditorApply(): Promise<void> {
    if (!editingAdmin) {
      return;
    }
    try {
      const updated = await AdminApi.update(admin.id, {
        manage_admin: editingAdmin.manage_admin,
        manage_category: editingAdmin.manage_category,
        manage_censor: editingAdmin.manage_censor,
        manage_intro: editingAdmin.manage_intro,
        manage_muter: editingAdmin.manage_muter,
      });

      enqueueSnackbar(t("editSuccess"), { variant: "success" });
      setEditingAdmin(null);
      onUpdated({ ...admin, ...updated });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("editFailed"), { variant: "error" });
    }
  }


  return (
    <>
      <Col my={1}>
        <Row>
          <Txt fontWeight={700}>{admin.user?.email ?? "email?"}</Txt>
          {me?.id == admin.user_id ? (
            <Box mx={1}>
              <Txt color='vague.main'>({t("me")})</Txt>
            </Box>
          ) : (
            <Row mx={2} >
              <Tooltip title={t("edit")}>
                <IconButton onClick={handleAdminEditClick}>
                  <EditIcon/>
                </IconButton>
              </Tooltip >
              <Tooltip title={t("delete")}>
                <IconButton onClick={handleAdminDeleteClick}>
                  <DeleteIcon/>
                </IconButton>
              </Tooltip>
            </Row>
          )}
        </Row>
        <Row columnGap={1} my={1}>
          {ADMIN_RIGHTS.every((item) => admin[item.right]) ?
            <Txt variant="body3" fontWeight={700}>{t("allRights")}</Txt> :
            <Txt variant="body3">{
              t("rights") + ": " + ADMIN_RIGHTS.filter((item) => admin[item.right]).map((item) => item.label).join(", ")
            }</Txt>
          }
        </Row>
      </Col>

      <Dialog
        open={Boolean(editingAdmin)}
        onClose={handleEditorClose}
      >
        {editingAdmin && (
          <Col m={2} minWidth={300}>
            <Txt variant='h6'>{t("editAdminRight")}</Txt>
            <Gap y={1}/>
            <Txt>{editingAdmin.user?.email} </Txt>

            <Gap y={1}/>
            <FormGroup >
              {(ADMIN_RIGHTS).map((item) => (
                <Fragment key={item.right}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={editingAdmin[item.right]}
                        onChange={(e): any => handleEditingAdminRightChange(e, item.right)}
                      />
                    }
                    label={item.label}
                  />
                </Fragment>
              )) }
            </FormGroup>

            <Gap y={2} />

            <Row justifyContent='flex-end'>
              <Button
                onClick={handleEditorClose}
              >
                {t("cancel")}
              </Button>
              <Button
                variant='contained'
                onClick={handleEditorApply}
              >
                {t("apply")}
              </Button>
            </Row>
          </Col>
        )}
      </Dialog>
    </>
  );
}