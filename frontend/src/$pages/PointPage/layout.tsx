"use client";
import React, { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { List, ListItemButton, ListItemIcon, ListItemText, Tabs, Tab } from "@mui/material";
import { Gap, Row, Box } from "@/ui/layouts";
import { ExitIcon, StarCircleIcon, ShopIcon, GifticonIcon } from "@/ui/icons";
import { ErrorBox } from "@/components/$statusTools";
import { useGroup } from "@/stores/GroupStore";
import { CategoryDrawerLayout } from "@/components/$layouts/CategoryDrawerLayout";
import { useResponsive } from "@/hooks/Responsive";

export function PointLayout({ tab, children }: { tab: string, children: ReactNode }): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const group = useGroup();

  const { downSm } = useResponsive();

  function handleTabClick(to: string): void {
    const newPath = `/points/${to}`;
    if (pathname.endsWith(newPath)) {
      return;
    }
    router.replace(newPath);
  }

  function handleBackClick(): void {
    router.push("/");
  }

  const tabs = [
    { label: "리워드 리포트", to: "report", icon: StarCircleIcon },
    { label: "기프티콘 샵", to: "shop", icon: ShopIcon },
    { label: "내 기프티콘", to: "coupon", icon: GifticonIcon },
  ];

  if (!group.use_point) {
    return (
      <ErrorBox
        height="60vh"
        message='해당 그룹에서는 접근할 수 없어요.'
        showHome
      />
    );
  }

  if (downSm) {
    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab ?? "report"}
            onChange={(e, value): void => handleTabClick(value)}
            variant='scrollable'
            scrollButtons
            allowScrollButtonsMobile
          >
            {tabs.map((tab) => {
              return (
                <Tab
                  key={tab.to}
                  value={tab.to}
                  label={
                    <Row>
                      <tab.icon fontSize='small' />
                      <Gap x={1} />
                      {tab.label}
                    </Row>
                  }
                />
              );
            })}
          </Tabs>
        </Box>

        {children}
      </>
    );
  } else {
    return (
      <CategoryDrawerLayout
        categories={[
          {
            label: undefined,
            tabs,
          },
        ]}
        currentTab={tab as any}
        drawerTail={
          <List>
            <ListItemButton onClick={handleBackClick}>
              <ListItemIcon>
                <ExitIcon />
              </ListItemIcon>
              <ListItemText primary='나가기' />
            </ListItemButton>
          </List>
        }
        mbOpen={false}
        onClose={(): void => {}}
        onTabClick={handleTabClick}
      >
        {children}
      </CategoryDrawerLayout>
    );
  }
}
