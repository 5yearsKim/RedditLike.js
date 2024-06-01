"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Container, Gap } from "@/ui/layouts";
import { Box, Tabs, Tab } from "@mui/material";
import { LoadingBox } from "@/components/$statusTools";
import { SearchRouter } from "./router";
// logic
import { type SyntheticEvent } from "react";
import { useRouter, useParams } from "next/navigation";


type SettingTabT = {
  label: string;
  to: string;
};


export function SettingPage(): JSX.Element {
  const t = useTranslations("pages.SettingPage");

  const TABS: SettingTabT[] = [
    {
      label: t("page"),
      to: "page",
    },
    {
      label: t("notification"),
      to: "notification",
    },
    {
      label: t("board"),
      to: "board",
    },
    // {
    //   label: '게시글',
    //   to: 'post',
    // },
    {
      label: t("chat"),
      to: "chat",
    },
  ];

  const router = useRouter();
  const { tab } = useParams();

  function handleTabChange(event: SyntheticEvent, to: string): void {
    if (tab === to) {
      return;
    }
    router.replace(`/settings/${to}`);
  }

  if (!tab) {
    return <LoadingBox height='60vh' />;
  }

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant='scrollable'
          scrollButtons='auto'
          allowScrollButtonsMobile
        >
          {TABS.map((tab) => {
            return (
              <Tab
                key={tab.to}
                label={tab.label}
                value={tab.to}
              />
            );
          })}
        </Tabs>
      </Box>

      <Gap y={3} />

      <SearchRouter tab={tab as string} />
    </Container>
  );
}
