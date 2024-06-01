import React from "react";
import { useTranslations } from "next-intl";
import { Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";


export function PostTab(): JSX.Element {
  const t = useTranslations("pages.SettingPage.PostTab");
  return (
    <>
      <Txt variant='h5'>{t("postSetting")}</Txt>

      <Gap y={4} />
    </>
  );
}
