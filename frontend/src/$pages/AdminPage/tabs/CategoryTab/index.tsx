import React from "react";
import { useTranslations } from "next-intl";
import { Gap, Container } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Divider } from "@mui/material";
import { CategorySection } from "./CategorySection";
import { CategoryBoardSection } from "./CategoryBoardSection";


export function CategoryTab(): JSX.Element {
  const t = useTranslations("pages.AdminPage.CategoryTab");
  return (
    <Container rtlP>

      <Txt variant='h6'>{t("boardCategory")}</Txt>

      <Gap y={1} />
      <Divider/>
      <Gap y={1} />


      <CategorySection/>

      <Gap y={8}/>

      <Txt variant='h6'>{t("boardList")}</Txt>

      <Gap y={1} />
      <Divider/>
      <Gap y={1} />

      <CategoryBoardSection/>


    </Container>
  );
}
