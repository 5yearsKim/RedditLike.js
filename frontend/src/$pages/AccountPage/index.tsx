"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Divider, Avatar, Button } from "@mui/material";
import { Container, Gap, Row, Col, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ErrorBox, LoadingBox } from "@/components/$statusTools";
// logic
import { useState } from "react";
import { useMe, useUserActions } from "@/stores/UserStore";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import * as UserApi from "@/apis/users";

export function AccountPage(): JSX.Element {
  const t = useTranslations("pages.AccountPage");
  const userAct = useUserActions();
  const me = useMe();
  const { showAlertDialog } = useAlertDialog();
  const router = useRouter();
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  async function handleWithdrawClick(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("withdrawGroup"),
      body: t("withdrawGroupMessage"),
      useOk: true,
      useCancel: true,
      themeDisabled: true,
    });
    if (!isOk) {
      return;
    }
    const isConfirmOk = await showAlertDialog({
      title: t("withdrawGroup"),
      body: t("withdrawGroupConfirm"),
      useOk: true,
      useCancel: true,
      themeDisabled: true,
    });
    if (!isConfirmOk) {
      return;
    }

    try {
      setIsWithdrawing(true);
      await UserApi.removeMe();
      userAct.logout();
      router.push("/withdraw-complete");
    } catch (e) {
      console.warn(e);
      setIsWithdrawing(false);
    }
  }


  if (isWithdrawing) {
    return (
      <Center width='100%'>
        <LoadingBox
          message={t("withdrawProcessing")}
          height='30vh'
        />
        ;
      </Center>
    );
  }
  if (!me) {
    return (
      <ErrorBox
        height='60vh'
        message={t("wrongAccess")}
        showHome
      />
    );
  }

  return (
    <Container rtlP>
      <Txt variant='h5'>{t("manageAccount")}</Txt>
      <Gap y={1}/>
      <Divider />
      <Gap y={2} />
      <Col alignItems='center'>

        <Avatar sx={{ width: 80, height: 80 }} />

        <Gap y={2} />

        <Txt fontWeight={500}>{me.email ?? "(unknown)"}</Txt>

        <Gap y={4} />

      </Col>

      <Row justifyContent='flex-end'>
        <Button onClick={handleWithdrawClick}>{t("withdrawGroup")}</Button>
      </Row>
    </Container>
  );
}
