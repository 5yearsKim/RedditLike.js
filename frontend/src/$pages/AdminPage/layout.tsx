import React from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { CategoryDrawerLayout, DrawerCategoryT } from "@/components/$layouts/CategoryDrawerLayout";
import { useNavbarDrawer } from "@/hooks/NavbarDrawer";
import { Divider, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import {
  CategoryIcon, AccountIcon, ManagerIcon, HomeIcon,
  LogoutIcon, BlockIcon as MuterIcon, CensorIcon,
} from "@/ui/icons";


type AdminLayoutProps = {
  children: JSX.Element;
};

export function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
  const t = useTranslations("pages.AdminPage");

  const router = useRouter();
  const { tab } = useParams();
  const { adminOpen, closeDrawer } = useNavbarDrawer();

  const categories: DrawerCategoryT[] = [
    {
      label: t("adminPage"),
      tabs: [
        { label: t("home"), to: "intro", icon: HomeIcon },
        { label: t("category"), to: "category", icon: CategoryIcon },
        { label: t("admin"), to: "admins", icon: ManagerIcon },
        { label: t("member"), to: "member", icon: AccountIcon },
        { label: t("restriction"), to: "muter", icon: MuterIcon },
        // { label: "게시글 관리", to: "post", icon: PostIcon },
        { label: t("contents"), to: "censor", icon: CensorIcon },
      ],
    },
  ];

  function handleTabClick(to: string): void {
    router.replace(`/admin/${to}`);
  }

  function handleExitClick(): void {
    router.push("/");
  }

  return (
    <CategoryDrawerLayout
      currentTab={tab.toString()}
      categories={categories}
      onTabClick={handleTabClick}
      mbOpen={adminOpen}
      onClose={closeDrawer}
      drawerTail={
        <>
          <Divider/>
          <ListItemButton onClick={handleExitClick}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>{t("toMain")}</ListItemText>
          </ListItemButton>
        </>
      }
    >
      {children}
    </CategoryDrawerLayout>
  );
}
