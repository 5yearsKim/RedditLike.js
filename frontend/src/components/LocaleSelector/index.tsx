"use client";
import React, { useState, ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Dialog, Button,
  FormControl, FormControlLabel, FormLabel, RadioGroup, Radio,
} from "@mui/material";
import { LanguageIcon } from "@/ui/icons";
import { Row, Gap, Col } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Clickable } from "@/ui/tools/Clickable";


const langDict: {[key: string]: string} = {
  en: "English",
  ko: "한국어",
};


export function LocaleSelector(): JSX.Element {
  const t = useTranslations("components.LocaleSelector");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(locale);

  function handleSelectorOpen(): void {
    setSelectorOpen(true);
  }

  function handleSelectorClose(): void {
    setSelectorOpen(false);
  }

  function handleLangChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setSelected(val);
  }

  function handleApplyClick(): void {
    if (selected === locale) {
      setSelectorOpen(false);
      return;
    }
    const segments = pathname.split("/");
    segments[1] = selected;
    const newPath = segments.join("/");
    router.replace(newPath);
    setSelectorOpen(false);
  }

  return (
    <>
      <Clickable
        border={1}
        borderRadius={8}
        px={1}
        py={0.5}
        onClick={handleSelectorOpen}
      >
        <Row>
          <LanguageIcon />
          <Gap x={0.5}/>
          <Txt variant="body2" fontWeight={500}>{langDict[locale]}</Txt>
        </Row>
      </Clickable>
      <Dialog
        open={selectorOpen}
        onClose={handleSelectorClose}
      >
        <Col
          py={2}
          px={2}
          minWidth={200}
        >
          <FormControl>
            <FormLabel>{t("selectLanguage")}</FormLabel>
            <RadioGroup
              value={selected}
              onChange={handleLangChange}
            >
              {Object.entries(langDict).map((item) => {
                const [lang, label] = item;
                return (
                  <FormControlLabel
                    key={lang}
                    value={lang}
                    control={<Radio />}
                    label={label}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>

          <Gap y={1}/>
          <Row
            justifyContent='flex-end'
            width='100%'
          >
            <Button
              onClick={handleSelectorClose}
            >
              {t("cancel")}
            </Button>
            <Button
              variant='contained'
              onClick={handleApplyClick}
            >
              {t("apply")}
            </Button>
          </Row>
        </Col>
      </Dialog>
    </>
  );
}