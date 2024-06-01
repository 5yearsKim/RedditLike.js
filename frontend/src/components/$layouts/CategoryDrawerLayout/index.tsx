"use client";
// export { CategoryDrawerLayout } from "./view";
// export type { DrawerCategoryT, DrawerTabT } from "./logic";
import React, { Fragment, ReactNode } from "react";
import { useTheme, List, ListItemButton, ListItemText, ListItemIcon, Box, Drawer } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { alpha } from "@mui/material/styles";
import { Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { NAV_HEIGHT, DRAWER_WIDTH } from "@/ui/global";


export type DrawerTabT = {
  label: string;
  to: string;
  icon?: any;
};

export type DrawerCategoryT = {
  // icon: JSX.Element
  label?: string;
  tabs: DrawerTabT[];
};

type CategoryDrawerLayoutProps = {
  drawerHead?: ReactNode;
  drawerTail?: ReactNode;
  categories: DrawerCategoryT[];
  currentTab?: string;
  mbOpen: boolean;
  children: ReactNode;
  onTabClick: (to: string) => any;
  onClose: () => void;
};


export function CategoryDrawerLayout({
  drawerHead,
  drawerTail,
  categories,
  mbOpen,
  children,
  currentTab,
  onTabClick,
  onClose,
}: CategoryDrawerLayoutProps): JSX.Element {

  function handleTabClick(to: string): void {
    onTabClick(to);
  }

  function handleMbDrawerClose(): void {
    onClose();
  }

  const { downSm } = useResponsive();

  function renderLayout(drawerContent: ReactNode, outlet: ReactNode): JSX.Element {
    if (downSm) {
      return (
        <Fragment>
          <Drawer
            anchor='left'
            open={mbOpen}
            onClose={handleMbDrawerClose}
            PaperProps={{
              elevation: 1,
              sx: { bgcolor: "paper.main" },
            }}
            sx={{
              width: DRAWER_WIDTH,
              zIndex: 10,
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                paddingTop: `${NAV_HEIGHT + 8}px`,
                width: DRAWER_WIDTH,
              },
            }}
          >
            {drawerContent}
          </Drawer>
          {outlet}
          {/* <Box position='fixed' top={10} left={10} bgcolor='green' sx={{ zIndex: 200 }}>
            <IconButton onClick={handleMbDrawerClick}>
              <MenuIcon/>
            </IconButton>
          </Box> */}
        </Fragment>
      );
    } else {
      return (
        <Box display='flex'>
          <Drawer
            variant='permanent'
            PaperProps={{
              elevation: 1,
              sx: { bgcolor: "paper.main" },
            }}
            sx={{
              width: DRAWER_WIDTH,
              zIndex: 10,
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                paddingTop: `${NAV_HEIGHT + 8}px`,
                width: DRAWER_WIDTH,
              },
            }}
          >
            {drawerContent}
          </Drawer>
          <Box flex={1}>{outlet}</Box>
        </Box>
      );
    }
  }

  return renderLayout(
    <div>
      {drawerHead && drawerHead}
      {categories.map((category, idx) => {
        return (
          <Fragment key={idx}>
            <DrawerCategory
              currentTab={currentTab}
              category={category}
              handleTabClick={handleTabClick}
            />
          </Fragment>
        );
      })}
      {drawerTail && drawerTail}
    </div>,
    children,
  );
}

export type DrawerCategoryProps = {
  category: DrawerCategoryT;
  currentTab?: string;
  handleTabClick: (to: string) => void;
};

export function DrawerCategory({
  category,
  currentTab,
  handleTabClick,
}: DrawerCategoryProps): JSX.Element {
  const theme = useTheme();

  return (
    <>
      {Boolean(category.label) && (
        <Box
          pl={2}
          pt={2}
        >
          <Row>
            <Box pr={1} />
            <Txt color='primary'>{category.label}</Txt>
          </Row>
        </Box>
      )}

      <List>
        {category.tabs.map((tab, idx) => (
          <ListItemButton
            key={idx}
            selected={currentTab == tab.to}
            // selected={true}
            onClick={(): void => handleTabClick(tab.to)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: alpha(theme.palette.primary.main, 1),
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.8),
                },
                "& .MuiListItemIcon-root": {
                  color: theme.palette.primary.contrastText,
                },
              },
            }}
          >
            {tab.icon && (
              <ListItemIcon>
                <tab.icon />
              </ListItemIcon>
            )}
            <ListItemText primary={tab.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
}
