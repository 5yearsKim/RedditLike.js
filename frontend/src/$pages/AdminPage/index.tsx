"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Center, Col, Gap } from "@/ui/layouts";
import { LoadingBox } from "@/components/$statusTools";
import { Txt } from "@/ui/texts";
import { Button } from "@mui/material";
import { AdminLayout } from "./layout";
import { AdminRouter } from "./router";
import { useMeAdmin } from "@/stores/UserStore";

export function AdminPage(): JSX.Element {
  const t = useTranslations("pages.AdminPage");

  const admin = useMeAdmin();

  if (admin === undefined) {
    return (
      <Center width='100%' height='60vh'>
        <Col alignItems='center'>
          <LoadingBox />
        </Col>
      </Center>
    );
  }

  if (admin == null) {
    return (
      <Center width='100%' height='60vh'>
        <Col alignItems='center'>
          <Txt variant="body1" color='vague.main'>{t("onlyAdmin")}</Txt>
          <Gap y={2}/>
          <Link href='/'>
            <Button variant='contained'>
              {t("home")}
            </Button>
          </Link>
        </Col>
      </Center>
    );
  }

  return (
    <AdminLayout>
      <AdminRouter />
    </AdminLayout>
  );
}
