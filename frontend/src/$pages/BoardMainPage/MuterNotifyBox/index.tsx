import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { BlockIcon } from "@/ui/icons";
import { Row, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { vizDate } from "@/utils/time";
import type { BoardMuterT } from "@/types";

type MuterNotifyBoxProps = {
  muter: BoardMuterT;
};

export function MuterNotifyBox({
  muter,
}: MuterNotifyBoxProps): JSX.Element {
  const t = useTranslations("pages.BoardMainPage.MuterNotifyBox");
  const locale = useLocale();

  return (
    <Box
      bgcolor='paper.main'
      borderRadius={1}
      width='100%'
      p={2}
      py={1}
      boxShadow='0 0 4px 2px rgba(0, 0, 0, 0.1)'
      mb={2}
    >
      <Row>
        <BlockIcon fontSize='small' />
        <Box mr={0.5} />
        <Txt variant='subtitle2' fontWeight={700}>{t("boardRestriction")}</Txt>
      </Row>
      <Box mt={0.5} />

      <Txt variant='body2'>{t("period")}: ~ {vizDate(muter.until, { type: "short", locale })}</Txt>
      <Txt variant='body2'>{t("reason")}: {muter.reason}</Txt>
    </Box>
  );
}
