"use client";
import React, { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Drawer, Box, Divider,
  List, ListItemButton, ListItemIcon, ListItemText,
} from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { DRAWER_WIDTH, NAV_HEIGHT } from "@/ui/global";
import { Row, Col, Gap, Expand } from "@/ui/layouts";
import { HomeIcon, DashboardIcon, HotIcon, AddIcon } from "@/ui/icons";
import { Txt } from "@/ui/texts";
import { GroupAvatar } from "@/ui/tools/Avatar";
import { GroupInfoDialog } from "@/components/GroupInfoDIalog";
import { DarkModeSelector } from "@/components/DarkModeSelector";
import { LocaleSelector } from "@/components/LocaleSelector";
import { RecentBoardSection } from "./RecentBoardSection";
import { FollowingBoardSection } from "./FollowingBoardSection";
import { ManagingBoardSection } from "./ManagingBoardSection";
// logic
import { useNavbarDrawer } from "@/hooks/NavbarDrawer";
import { useMe, useMeAdmin } from "@/stores/UserStore";
import { useGroup } from "@/stores/GroupStore";
import { FRONT_URL_SUFFIX } from "@/config";
import type { BoardT } from "@/types";

export function MainDrawerLayout(): ReactNode {
  const t = useTranslations("components.$layouts.MainDrawerLayout");
  const me = useMe();
  const admin = useMeAdmin();
  const group = useGroup();
  // const router = useRouter();
  const router = useRouter();
  const { mainOpen, closeDrawer } = useNavbarDrawer();
  const [groupDialogOpen, setGroupDialogOpen] = useState<boolean>(false);

  function handleClose(): void {
    closeDrawer();
  }

  function handleNavigateBoard(board: BoardT): void {
    // closeDrawer();
    router.replace(`/boards/${board.id}`);
  }

  function handleNavigateTo(to: string): void {
    // closeDrawer();
    router.replace(to);
  }


  const { downSm } = useResponsive();

  return (
    <MDrawer isOpen={mainOpen} onClose={handleClose}>
      <Col minHeight={`calc(100vh - ${NAV_HEIGHT + 15}px)`}>
        <List>
          {downSm && (
            <>
              <ListItemButton onClick={() => setGroupDialogOpen(true)} >
                <Row>
                  <GroupAvatar group={group} size={34}/>
                  <Gap x={1}/>
                  <Col>
                    <Txt fontWeight={700}>{group.short_name ?? group.name}</Txt>
                    <Txt variant="body3">{group.key}.{FRONT_URL_SUFFIX}</Txt>
                  </Col>
                </Row>
              </ListItemButton>
              {/* <Button
              fullWidth
              size='small'
              startIcon={<SettingIcon/>}
            >
              그룹 관리
            </Button> */}

              <GroupInfoDialog
                group={group}
                open={groupDialogOpen}
                onClose={() => setGroupDialogOpen(false)}
              />

              <Divider sx={{ my: 1 }}/>
            </>
          )}

          <ListItemButton onClick={(): void => handleNavigateTo("/")}>
            <ListItemIcon>
              <HomeIcon color='primary' />
            </ListItemIcon>
            <ListItemText>
              <Txt fontWeight={500}>{t("home")}</Txt>
            </ListItemText>
          </ListItemButton>
          <ListItemButton onClick={(): void => handleNavigateTo("/hots")}>
            <ListItemIcon>
              <HotIcon color='secondary' />
            </ListItemIcon>
            <ListItemText>
              <Txt fontWeight={500}>{t("popular")}</Txt>
            </ListItemText>
          </ListItemButton>
          <ListItemButton onClick={(): void => handleNavigateTo("/boards")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText>
              <Txt fontWeight={500}>{t("boards")}</Txt>
            </ListItemText>
          </ListItemButton>

          {me && (group.allow_create_board == true || admin != null) && (
            <ListItemButton onClick={(): void => handleNavigateTo("/boards/create")}>
              <ListItemIcon>
                <AddIcon
                  color='primary'
                  sx={{ fontSize: 28 }}
                />
              </ListItemIcon>
              <Txt
                fontWeight={500}
                color='primary'
              >
                {t("createBoard")}
              </Txt>
            </ListItemButton>
          )}
        </List>

        <RecentBoardSection
          title={t("recentVisit")}
          onNavigateBoard={handleNavigateBoard}
        />

        {me && (
          <Box mt={4}>
            <FollowingBoardSection
              title={t("subscribed")}
              onNavigateBoard={handleNavigateBoard}
            />
          </Box>
        )}

        {me && (
          <Box mt={4}>
            <ManagingBoardSection
              title={t("managing")}
              onNavigateBoard={handleNavigateBoard}
            />
          </Box>
        )}

        <Gap y='60px'/>
        <Expand />

        <Row
          width='100%'
          justifyContent='flex-end'
          py={1}
          px={1}
        >
          <LocaleSelector />
          <DarkModeSelector />
        </Row>
      </Col>
    </MDrawer>
  );
}

type MDrawerProps = {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => any;
};

function MDrawer({
  isOpen,
  children,
  onClose,
}: MDrawerProps): ReactNode {

  return (
    <Drawer
      anchor='left'
      open={isOpen}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        zIndex: 10,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          paddingTop: `${NAV_HEIGHT + 8}px`,
        },
      }}
      PaperProps={{
        elevation: 1,
        sx: { bgcolor: "paper.main" },
      }}
    >
      <Box width={DRAWER_WIDTH}>
        {children}
      </Box>
    </Drawer>
  );
}
