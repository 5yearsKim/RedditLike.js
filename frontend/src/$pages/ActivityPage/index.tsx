"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Tabs, Tab } from "@mui/material";
import { Container, Gap, Row, Box } from "@/ui/layouts";
import { ErrorBox } from "@/components/$statusTools";
import { ActivityRouter } from "./router";
// logic
import { SyntheticEvent } from "react";
import { BookmarkOlIcon } from "@/ui/icons";
import { useMe } from "@/stores/UserStore";

type ActivityTabT = {
  label: string;
  to: string;
  icon?: any;
};


export function ActivityPage(): JSX.Element {
  const t = useTranslations("pages.ActivityPage");
  const router = useRouter();
  const me = useMe();
  const { tab } = useParams();

  const TABS: ActivityTabT[] = [
    {
      label: t("boardSubscribed"),
      to: "board",
    },
    {
      label: t("myPosts"),
      to: "post",
    },
    {
      label: t("myComments"),
      to: "comment",
    },
    {
      label: t("myBookmark"),
      to: "bookmark",
      icon: BookmarkOlIcon,
    },
  ];

  function handleTabChange(event: SyntheticEvent, to: string): void {
    if (tab === to) {
      return;
    }
    if (["board", "post", "comment", "bookmark"].includes(to)) {
      router.replace(`/activities/${to}`);
    }
  }

  if (!tab) {
    return (
      <ErrorBox
        height='60vh'
        message={t("wrongAccess")}
      />
    );
  }

  if (!me) {
    return (
      <ErrorBox
        height='60vh'
        message={t("noAccount")}
      />
    );
  }

  return (
    <Container rtlP>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant='scrollable'
          scrollButtons='auto'
        >
          {TABS.map((tab) => {
            return (
              <Tab
                key={tab.to}
                label={
                  tab.icon ? (
                    <Row>
                      <tab.icon />
                      <Box mr={0.5} />
                      {tab.label}
                    </Row>
                  ) : (
                    tab.label
                  )
                }
                value={tab.to}
              />
            );
          })}
        </Tabs>
      </Box>
      <Gap y={3} />
      <ActivityRouter
        tab={tab as string}
        me={me}
      />
    </Container>
  );
}
