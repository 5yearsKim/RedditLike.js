"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Toolbar, Hidden, Divider, Collapse } from "@mui/material";
import { Box, Row, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { useResponsive } from "@/hooks/Responsive";
import { useSearch$ } from "@/stores/SearchStore";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarActions } from "./NavbarActions";
import { NavbarMenuButton } from "./NavbarMenuButton";
import { SearchBar } from "./SearchBar";
import { FocusTab } from "./FocusTab";


export function Navbar() {
  const t = useTranslations("components.Navbar");
  const { downSm } = useResponsive();
  const search$ = useSearch$();

  return (
    <Row width='100%'>
      <Toolbar
        sx={{
          margin: "auto",
          width: "100%",
          maxWidth: 1200,
        }}
      >
        <NavbarMenuButton/>

        <Hidden mdDown implementation='css'>
          <Row>
            <NavbarLogo/>

            <Divider
              orientation='vertical'
              sx={{ height: 30, ml: 1.5, mr: 1 }}
            />

            <Link href='/boards'>
              <FocusTab isFocused={(path): boolean => path.endsWith("/boards")}>
                <Txt variant='subtitle2'>{t("allBoard")}</Txt>
              </FocusTab>
            </Link>
          </Row>
        </Hidden>

        <Box ml={{ xs: 1, sm: 2 }} />

        <Expand>
          <SearchBar/>
        </Expand>

        <Gap x={1}/>

        <Collapse
          orientation='horizontal'
          in={!(downSm && search$.isSearchFocused)}
        >
          <NavbarActions/>
        </Collapse>

      </Toolbar>
    </Row>
  );
}