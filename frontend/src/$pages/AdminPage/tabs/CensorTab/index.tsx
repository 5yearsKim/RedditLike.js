import React from "react";
import { useTranslations } from "next-intl";
import { Divider } from "@mui/material";
import { Container, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { TrashedBoardList } from "./TrashedBoardList";

export function CensorTab() {
  const t = useTranslations("pages.AdminPage.CensorTab");
  return (
    <Container rtlP>

      <Txt variant='h6'>{t("manageContents")}</Txt>

      <Gap y={1}/>
      <Divider/>
      <Gap y={1}/>

      <Txt variant='body1' fontWeight={700}>{t("hiddenBoards")}</Txt>

      <Gap y={2}/>

      <TrashedBoardList/>

    </Container>
  );

}