"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Container, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { NoRightIndicator } from "../../NoRightIndicator";

import { useBoardMain$ } from "@/stores/BoardMainStore";

import { RulesSection } from "./RulesSection";
// import { RelationSection } from "./sections/RelationSection";
// import { LinkSection } from "./sections/_LinkSection";

export function InfoTab(): JSX.Element {
  const t = useTranslations("pages.ManagingPage.InfoTab");
  const boardMain$ = useBoardMain$();

  const { manager } = boardMain$.data!;
  if (!manager?.manage_info) {
    return <NoRightIndicator title={t("boardInfo")} />;
  }
  return (
    <Container rtlP>
      <Txt variant='h5'>{t("boardInfo")}</Txt>

      <Gap y={4} />

      <RulesSection/>

      {/* <Gap y={4} />

      <LinkSection board={board} /> */}

      {/* <Gap y={4} />

      <RelationSection board={board} /> */}
    </Container>
  );
}
