"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Container, Row, Gap } from "@/ui/layouts";
import { AddIcon } from "@/ui/icons";
import { Txt } from "@/ui/texts";
import { Divider, Button } from "@mui/material";
import { ErrorBox, InitBox, LoadingBox } from "@/components/$statusTools";
// logic
import { useEffect } from "react";
import * as GroupAdminApi from "@/apis/group_admins";
import { useListData } from "@/hooks/ListData";
import { useSnackbar } from "@/hooks/Snackbar";
import { useGroup } from "@/stores/GroupStore";
import { emailValidator } from "@/utils/validator";
import { GroupAdminItem } from "./GroupAdminItem";
import type { GroupAdminT, ListGroupAdminOptionT } from "@/types";

export function AdminTab(): JSX.Element {
  const t = useTranslations("pages.AdminPage.AdminTab");
  const { enqueueSnackbar } = useSnackbar();

  const group = useGroup();

  const listOpt: ListGroupAdminOptionT = {
    groupId: group.id,
    $user: true,
    $account: true,
  };

  const { data: groupAdmins$, actions: groupAdminsAct } = useListData({
    listFn: GroupAdminApi.list,
  });

  useEffect(() => {
    groupAdminsAct.load(listOpt);
  }, []);

  function handleErrorRetry(): void {
    groupAdminsAct.load(listOpt, { force: true });
  }


  async function handleAdminAddClick(): Promise<void> {
    const email = prompt(t("pleaseEnterEmail"), "");
    if (!email) {
      return;
    }
    const emailError = emailValidator()(email);
    if (emailError) {
      enqueueSnackbar(t("wrongEmailFormat"), { variant: "info" });
      return;
    }
    try {
      await GroupAdminApi.createByEmail(email, group.id);
      await groupAdminsAct.load(listOpt, { force: true, skipLoading: true });
      enqueueSnackbar(t("addAdminSuccess"), { variant: "success" });
    } catch (e: any) {
      const code = e.response?.data?.code;
      if (code == "ALREADY_EXIST") {
        enqueueSnackbar(t("adminAlreadyExist"), { variant: "info" });
      } else if (code == "NOT_EXIST") {
        enqueueSnackbar(t("userNotExist"), { variant: "info" });
      } else {
        console.warn(e);
        enqueueSnackbar(t("addAdminFailed"), { variant: "error" });
      }
    }
  }


  function handleAdminDeleted(deleted: GroupAdminT): void {
    groupAdminsAct.filterItems((item) => item.id != deleted.id);
  }

  function handleAdminUpdated(updated: GroupAdminT): void {
    groupAdminsAct.replaceItem(updated);
  }


  return (
    <Container rtlP>
      <Txt variant="h6">{t("manageAdmin")}</Txt>
      <Gap y={1}/>

      <Divider/>

      <Gap y={2}/>

      {groupAdmins$.status == "init" && (
        <InitBox/>
      )}

      {groupAdmins$.status == "loading" && (
        <LoadingBox/>
      )}

      {groupAdmins$.status == "error" && (
        <ErrorBox onRetry={handleErrorRetry}/>
      )}

      {groupAdmins$.status == "loaded" && (
        <>
          <Row width='100%' justifyContent='flex-end'>
            <Button
              variant='contained'
              onClick={handleAdminAddClick}
              startIcon={<AddIcon/>}
            >
              {t("addAdmin")}
            </Button>
          </Row>
          {groupAdmins$.data.map((admin) => {
            return (
              <Fragment key={admin.id}>
                <GroupAdminItem
                  admin={admin}
                  onDeleted={handleAdminDeleted}
                  onUpdated={handleAdminUpdated}
                />

              </Fragment>
            );
          })}
        </>
      )}
    </Container>
  );
}
