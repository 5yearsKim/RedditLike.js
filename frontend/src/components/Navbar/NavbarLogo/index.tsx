"use client";

import React, { useState, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Row, Box } from "@/ui/layouts";
import { useTranslations } from "next-intl";
import { ArrowDropDownIcon, SettingIcon } from "@/ui/icons";
import { Txt } from "@/ui/texts";
import { Popover, IconButton, Button } from "@mui/material";
import { useMeAdmin } from "@/stores/UserStore";

export function NavbarLogo() {
  const [popoverEl, setPopoverEl] = useState<null | HTMLElement>(null);
  const admin = useMeAdmin();
  const router = useRouter();

  const t = useTranslations("components.Navbar.NavbarLogo");

  function handleAdminButtonClick(): void {
    router.push("/admin/intro");
    setPopoverEl(null);
  }


  function handleDropdownClick(e: MouseEvent<HTMLElement> ) {
    setPopoverEl(e.currentTarget);
  }


  return (
    <>
      <Row>
        <Link href='/'>
          <Box ml={1} mr={0.5}>
            <Txt variant='h6'>{"RedditLike.js"}</Txt>
          </Box>
        </Link>

        {admin !== null && (
          <IconButton
            size='small'
            onClick={handleDropdownClick}
          >
            <ArrowDropDownIcon/>
          </IconButton>
        )}

      </Row>
      <Popover
        anchorEl={popoverEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={Boolean(popoverEl)}
        onClose={() => setPopoverEl(null)}
      >
        {admin !== null && (
          <Button
            fullWidth
            // size='small'
            startIcon={<SettingIcon />}
            onClick={handleAdminButtonClick}
          >
            {t("adminPage")}
          </Button>
        )}
      </Popover>
    </>

  );

}