"use client";
import React, { ReactNode } from "react";
import { IconButton, Box } from "@mui/material";
import { MenuIcon } from "@/ui/icons";
// logic
import { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useNavbarDrawer } from "@/hooks/NavbarDrawer";

export function NavbarMenuButton(): ReactNode {
  const { mainOpen, managingOpen, adminOpen, openDrawer, closeDrawer } = useNavbarDrawer();

  const pathname = usePathname();
  const isManagingMode = pathname.includes("/managings");
  const isAdminMode = pathname.includes("/admin");

  const isHideButtonOnMb = isManagingMode || isAdminMode;

  function handleClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    if (mainOpen || managingOpen || adminOpen) {
      closeDrawer();
    } else {
      if (isManagingMode) {
        openDrawer("managing");
      } else if (isAdminMode) {
        openDrawer("admin");
      } else {
        openDrawer("main");
      }
    }
  }

  return (
    <Box display={isHideButtonOnMb ? { xs: "block", sm: "none" } : undefined}>
      <IconButton
        aria-label='menu-button'
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );
}
