"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { BoardPreview } from "@/components/BoardPreview";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { Box } from "@/ui/layouts";
import { LogoutIcon, CategoryIcon } from "@/ui/icons";
import { CategorySelectDialog } from "./CategorySelectDialog";
// logic
import { useState, MouseEvent } from "react";
import * as XBoardCategoryApi from "@/apis/x_board_category";
import { useSnackbar } from "@/hooks/Snackbar";
import type { BoardT, CategoryT } from "@/types";

type BoardPreviewItemProps = {
  board: BoardT;
};

export function BoardPreviewItem({ board }: BoardPreviewItemProps): JSX.Element {
  const t = useTranslations("pages.AdminPage.CategoryTab.CategoryBoardSection.BoardPreviewItem");
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false);
  const menuOpen = Boolean(menuEl);

  function handleClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setMenuEl(e.currentTarget);
  }

  function handleMenuClose(): void {
    setMenuEl(null);
  }

  function handleNavigateClick(): void {
    router.push(`/boards/${board.id}`);
    setMenuEl(null);
  }

  function handleAssignCategoryClick(): void {
    setCategoryDialogOpen(true);
    setMenuEl(null);
  }

  function handleCategoryDialogClose(): void {
    setCategoryDialogOpen(false);
  }

  async function handleCategorySelect(categories: CategoryT[]): Promise<void> {
    try {
      await XBoardCategoryApi.link(board.id, categories.map((item) => item.id));
      enqueueSnackbar("카테고리가 연결되었어요. 새로고침 후 확인해주세요.", { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar( "카테고리를 연결할 수 없어요.", { variant: "error" });
    }
  }

  return (
    <>
      <Box onClick={handleClick} width='100%'>
        <BoardPreview
          board={board}
          selected={false}
          disableRouting
        />
      </Box>
      <Menu
        anchorEl={menuEl}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleNavigateClick}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>
            {t("moveToBoard")}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAssignCategoryClick}>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText>
            {t("assignCategory")}
          </ListItemText>
        </MenuItem>
      </Menu>
      <CategorySelectDialog
        open={categoryDialogOpen}
        onClose={handleCategoryDialogClose}
        onSelect={handleCategorySelect}
      />
    </>
  );
}
