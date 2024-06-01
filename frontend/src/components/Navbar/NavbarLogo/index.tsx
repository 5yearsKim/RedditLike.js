"use client";

import React, { useState, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { IconButton, Popover, Divider, Button } from "@mui/material";
import { ArrowDropDownIcon, SettingIcon } from "@/ui/icons";
import { Row, Col, Box, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { GroupAvatar } from "@/ui/tools/Avatar";
import { Clickable } from "@/ui/tools/Clickable";
import { FRONT_URL_SUFFIX } from "@/config";
import { GroupInfoDialog } from "@/components/GroupInfoDIalog";
import { MyGroupList } from "@/components/MyGroupList";
// logic
import type { GroupT } from "@/types/Group";
import { useSnackbar } from "@/hooks/Snackbar";
import { useGroup, useGroupActions } from "@/stores/GroupStore";
import { useUser$ } from "@/stores/UserStore";

export function NavbarLogo() {
  const t = useTranslations("components.Navbar.NavbarLogo");
  const router = useRouter();
  const user$ = useUser$();
  const group = useGroup();
  const groupAct = useGroupActions();
  const { enqueueSnackbar } = useSnackbar();
  const [popoverEl, setPopoverEl] = useState<null|HTMLElement>(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState<boolean>(false);


  function handleDropdownClick(e: MouseEvent<HTMLElement> ) {
    setPopoverEl(e.currentTarget);
  }

  function handleGroupClick(group: GroupT): void {
    groupAct.set({ status: "loaded", data: { group } });
    let href = `/${group.key}`;
    if (group.locale) {
      href = `/${group.locale}${href}`;
    }
    router.push(href);
    setPopoverEl(null);
    enqueueSnackbar(t("switchGroupSuccess", { groupName: group.name }), { variant: "success" });
  }

  function handleCurrentGroupClick(): void {
    setGroupDialogOpen(true);
    setPopoverEl(null);
  }

  function handleGroupAdminButtonClick(): void {
    router.push("/admin/intro");
    setPopoverEl(null);
  }


  return (
    <>
      <Row>
        <Link href='/'>
          <Box ml={1} mr={0.5}>
            <Txt variant='h6'>{(group.short_name ?? group.name).toUpperCase()}</Txt>
          </Box>
        </Link>
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
        <Clickable onClick={handleCurrentGroupClick}>
          <Row p={1}>
            <GroupAvatar group={group} size={36}/>
            <Gap x={1}/>
            <Col>
              <Txt fontWeight={500}>{group.name}</Txt>
              <Txt variant="body3">{group.key}.{FRONT_URL_SUFFIX}</Txt>
            </Col>
          </Row>
        </Clickable>

        {user$.data?.admin !== null && (
          <Button
            fullWidth
            size='small'
            startIcon={<SettingIcon/>}
            onClick={handleGroupAdminButtonClick}
          >
            {t("adminPage")}
          </Button>
        )}
        <Divider/>
        <Gap y={1}/>

        <MyGroupList
          onGroupClick={handleGroupClick}
        />
        <Gap y={1}/>
      </Popover>
      <GroupInfoDialog
        group={group}
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
      />
    </>
  );

}