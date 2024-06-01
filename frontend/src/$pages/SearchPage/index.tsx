"use client";
import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Container, Gap } from "@/ui/layouts";
import { Box, Tabs, Tab } from "@mui/material";
import { SearchRouter } from "./router";
// logic
import { SyntheticEvent } from "react";

type SearchTabT = {
  label: string;
  to: string;
};


export function SearchPage(): ReactNode {
  const t = useTranslations("pages.SearchPage");

  const TABS: SearchTabT[] = [
    {
      label: t("post"),
      to: "post",
    },
    {
      label: t("board"),
      to: "board",
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const { tab } = useParams();
  const q = searchParams.get("q");

  function handleTabChange(event: SyntheticEvent, to: string): void {
    if (tab === to) {
      return;
    }
    if (to === "board" || to === "post") {
      router.replace(`/searches/${to}?q=${q}`);
    }
  }

  if (!tab) {
    return <p>tab not defined</p>;
  }

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
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
      <SearchRouter
        tab={tab as string}
        q={q?.toString() ?? ""}
      />
    </Container>
  );
}
