"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@mui/material";
import { Container, Gap, Row, Col } from "@/ui/layouts";
import { CloseIcon } from "@/ui/icons";
import { Txt } from "@/ui/texts";
import { useMeMuter, useMeAdmin } from "@/stores/UserStore";
import { CreateBoardForm } from "./CreateBoardForm";

export function CreateBoardPage(): JSX.Element {
  const t = useTranslations("pages.CreateBoardPage");
  const muter = useMeMuter();
  const admin = useMeAdmin();

  function renderForm(): JSX.Element {
    if (muter) {
      return (
        <Col alignItems='center'>
          <Row>
            <CloseIcon/>
            <Gap x={1}/>
            <Txt>{t("restricted")}</Txt>
          </Row>
          <Gap y={2}/>
          <Link href='/restrictions'>
            <Button variant="contained">
              {t("checkRestriction")}
            </Button>
          </Link>
        </Col>
      );
    }
    if (false && !admin) {
      return (
        <Col alignItems='center'>
          <Row>
            <CloseIcon/>
            <Gap x={1}/>
            <Txt>{t("adminOnly")}</Txt>
          </Row>
        </Col>
      );
    }
    return <CreateBoardForm/>;
  }

  return (
    <Container maxWidth='sm' rtlP>
      <Gap y={2} />

      {renderForm()}

    </Container>
  );
}
