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
import * as AdminApi from "@/apis/admins";
import { useListData } from "@/hooks/ListData";
import { useSnackbar } from "@/hooks/Snackbar";
import { emailValidator } from "@/utils/validator";
import { AdminItem } from "./AdminItem";
import type { AdminT, ListAdminOptionT } from "@/types";

export function AdminTab(): JSX.Element {
  const t = useTranslations("pages.AdminPage.AdminTab");
  const { enqueueSnackbar } = useSnackbar();


  const listOpt: ListAdminOptionT = {
    $user: true,
  };

  const { data: admins$, actions: adminsAct } = useListData({
    listFn: AdminApi.list,
  });

  useEffect(() => {
    adminsAct.load(listOpt);
  }, []);

  function handleErrorRetry(): void {
    adminsAct.load(listOpt, { force: true });
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
      await AdminApi.createByEmail(email);
      await adminsAct.load(listOpt, { force: true, skipLoading: true });
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


  function handleAdminDeleted(deleted: AdminT): void {
    adminsAct.filterItems((item) => item.id != deleted.id);
  }

  function handleAdminUpdated(updated: AdminT): void {
    adminsAct.replaceItem(updated);
  }


  return (
    <Container rtlP>
      <Txt variant="h6">{t("manageAdmin")}</Txt>
      <Gap y={1}/>

      <Divider/>

      <Gap y={2}/>

      {admins$.status == "init" && (
        <InitBox/>
      )}

      {admins$.status == "loading" && (
        <LoadingBox/>
      )}

      {admins$.status == "error" && (
        <ErrorBox onRetry={handleErrorRetry}/>
      )}

      {admins$.status == "loaded" && (
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
          {admins$.data.map((admin) => {
            return (
              <Fragment key={admin.id}>
                <AdminItem
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
