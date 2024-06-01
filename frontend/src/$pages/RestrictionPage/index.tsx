"use client";
import React from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Divider } from "@mui/material";
import { Txt } from "@/ui/texts";
import { CloseIcon } from "@/ui/icons";
import { Container, Row, Col, Gap } from "@/ui/layouts";
import { useMeMuter } from "@/stores/UserStore";
import { vizDate } from "@/utils/time";

export function RestrictionPage(): JSX.Element {
  const t = useTranslations("pages.RestrictionPage");
  const locale = useLocale();
  const muter = useMeMuter();

  return (
    <Container rtlP>
      <Txt variant='h5'>{t("restrictions")}</Txt>
      <Gap y={1}/>
      <Divider/>

      <Gap y={2}/>

      {muter ? (
        <Col rowGap={1}>
          <Txt><b>{t("status")}:</b> {t("restricted")}</Txt>
          <Txt><b>{t("reason")}:</b> {muter.reason}</Txt>
          <Txt><b>{t("duration")}: </b>{vizDate(muter.created_at, { type: "short", locale })} ~ {vizDate(muter.until, { type: "short", locale })}</Txt>
        </Col>
      ) : (
        <Row width='100%' justifyContent='center'>
          <CloseIcon/>
          <Gap x={1}/>
          <Txt>{t("noRestriction")}</Txt>
        </Row>
      )}

    </Container>
  );
}