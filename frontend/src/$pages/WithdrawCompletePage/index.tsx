import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@mui/material";
import { Container, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { HomeIcon } from "@/ui/icons";

export function WithdrawCompletePage(): JSX.Element {
  const t = useTranslations("pages.WithdrawCompletePage");
  return (
    <Container rtlP>
      <Gap y={2} />
      <Col alignItems='center'>

        <Txt variant='h6'>{t("withdrawComplete")}</Txt>

        <Gap y={2} />

        <Link href='/'>
          <Button
            variant='contained'
            startIcon={<HomeIcon />}
          >
            {t("toHome")}
          </Button>
        </Link>
      </Col>
    </Container>
  );
}
