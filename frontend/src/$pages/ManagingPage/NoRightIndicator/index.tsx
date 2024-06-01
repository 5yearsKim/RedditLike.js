import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import { Container, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

export type NoRightIndicatorProps = {
  title: string;
};

export function NoRightIndicator({ title }: NoRightIndicatorProps): ReactNode {
  const t = useTranslations("pages.ManagingPage.NoRightIndicator");
  return (
    <Container rtlP>
      <Txt variant='h5'>{title}</Txt>

      <Box mt={{ xs: 0, sm: 2 }} />

      <Center width='100%'>
        <Txt color='vague.main'>{t("noRight")}</Txt>
      </Center>
    </Container>
  );
}
