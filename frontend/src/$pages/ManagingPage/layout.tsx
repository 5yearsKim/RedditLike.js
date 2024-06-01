"use client";
import React, { useEffect, Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { List, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { toId } from "@/utils/formatter";
import { CategoryDrawerLayout, DrawerCategoryT } from "@/components/$layouts/CategoryDrawerLayout";
import { useNavbarDrawer } from "@/hooks/NavbarDrawer";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { BoardThemeProvider } from "@/ui/tools/BoardThemeProvider";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";

import {
  CensorIcon,
  ReportIcon,
  ManagerIcon,
  BlockIcon as MuterIcon,
  HomeIcon as IntroIcon,
  InfoIcon,
  FlagIcon,
  FlairIcon,
  ExitIcon,
  SettingIcon,
} from "@/ui/icons";


export function ManagingLayout({ children }: { children: ReactNode }): ReactNode {
  const t = useTranslations("pages.ManagingPage");
  const router = useRouter();
  const { boardId: _boardId, tab } = useParams();
  const boardId = toId(_boardId);

  const { managingOpen, closeDrawer } = useNavbarDrawer();

  const boardMain$ = useBoardMain$();
  const boardMainAct = useBoardMainActions();

  useEffect(() => {
    boardMainAct.load({ id: boardId });
  }, [boardId]);


  function handleTabClick(to: string): void {
    const path = `/boards/${boardId}/managings/${to}`;
    router.replace(path);
  }

  function handleExit(): void {
    router.push(`/boards/${boardId}`);
    // router.back();
  }

  function handleErrorRetry(): void {
    boardMainAct.load({ id: boardId }, { force: true });
  }


  if (boardId == 0) {
    <ErrorBox
      message={t("invalidBoardId")}
      showHome
    />;
  }

  const categories: DrawerCategoryT[] = [
    {
      label: t("censorContent"),
      tabs: [
        { label: t("censorContent"), to: "censor", icon: CensorIcon },
        { label: t("report") , to: "report", icon: ReportIcon },
      ],
    },
    {
      label: t("user"),
      tabs: [
        { label: t("restriction"), to: "muter", icon: MuterIcon },
        { label: t("manager"), to: "manager", icon: ManagerIcon },
      ],
    },
    {
      label: t("manageBoard"),
      tabs: [
        { label: t("intro") , to: "intro", icon: IntroIcon },
        { label: t("info"), to: "info", icon: InfoIcon },
        { label: t("userExposure"), to: "exposure", icon: FlairIcon },
        { label: t("contentSetting"), to: "contents", icon: FlagIcon },
        { label: t("etc"), to: "etc", icon: SettingIcon },
      ],
    },
  ];

  const { status } = boardMain$;

  if (status == "init") {
    return <InitBox height='60vh'/>;
  }
  if (status == "loading") {
    return <LoadingBox height='60vh'/>;
  }
  if (status == "error") {
    return <ErrorBox height='60vh' onRetry={handleErrorRetry}/>;
  }

  const board = boardMain$.data!.board;


  return (
    <BoardThemeProvider board={board}>
      <CategoryDrawerLayout
        mbOpen={managingOpen}
        currentTab={tab?.toString()}
        categories={categories}
        onTabClick={handleTabClick}
        drawerTail={
          <Fragment>
            <Divider />
            <List>
              <ListItemButton onClick={handleExit}>
                <ListItemIcon>
                  <ExitIcon />
                </ListItemIcon>
                <ListItemText primary={t("exit")} />
              </ListItemButton>
            </List>
          </Fragment>
        }
        onClose={closeDrawer}
      >
        {children}
      </CategoryDrawerLayout>
    </BoardThemeProvider>
  );
}
