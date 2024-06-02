import React, { } from "react";
import { useTranslations } from "next-intl";
import { Container, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CurrentMemberSection } from "./CurrentMemeberSection";

// logic

export function MemberTab() {
  const t = useTranslations("pages.AdminPage.MemberTab");


  return (
    <Container rtlP>
      <Txt variant="h6">{t("manageMember")}</Txt>

      <Gap y={2}/>

      <CurrentMemberSection/>

    </Container>
  );
}