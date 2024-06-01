"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dialog, Button, IconButton } from "@mui/material";
import { Col, Row, Gap, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CopyIcon, SettingIcon } from "@/ui/icons";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";
import { useGroupProtectionMap } from "@/components/GroupProtectionSelector/data";
import { FRONT_URL_SUFFIX } from "@/config";
import { useSnackbar } from "@/hooks/Snackbar";
import { useMeAdmin } from "@/stores/UserStore";
import QRCode from "react-qr-code";
import type { GroupT } from "@/types";

type GroupInfoDialogProps = {
  group: GroupT
  open: boolean;
  onClose: () => void;
}


export function GroupInfoDialog({
  group,
  open,
  onClose,
}: GroupInfoDialogProps): JSX.Element {
  const t = useTranslations("components.GroupInfoDialog");
  const admin = useMeAdmin();
  const router = useRouter();

  const groupProtectionMap = useGroupProtectionMap();
  const { enqueueSnackbar } = useSnackbar();
  const groupUrl = `https://${group.key}.${FRONT_URL_SUFFIX}`;

  function handleCopyClick(): void {
    navigator.clipboard.writeText(groupUrl);
    enqueueSnackbar(t("copiedToClipboard"), { variant: "success" });
  }

  function handleCloseClick(): void {
    onClose();
  }

  function handleNavigateAdminClick(): void {
    router.push("/admin/intro");
    onClose();
  }

  const protectionInfo = groupProtectionMap[group.protection];

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <Col
        px={2}
        py={2}
        maxWidth={300}
        minWidth={250}
      >
        <Row>
          <Txt variant='h6'>{group.name}</Txt>
        </Row>

        <Gap y={1}/>

        <Txt variant='body2' color='vague.main'>{group.description ? group.description : `(${t("noDescription")})`}</Txt>

        {admin && (
          <Row width='100%' justifyContent='flex-end'>
            <Button
              startIcon={<SettingIcon fontSize="small"/>}
              onClick={handleNavigateAdminClick}
            >
              {t("adminGroup")}
            </Button>
          </Row>
        )}

        <Gap y={4}/>


        <Row>
          <Txt variant="body1" fontWeight={700}>{t("accessInfo")}</Txt>
          <Expand/>

          <Row>
            <Txt variant='body3'>{protectionInfo.name}</Txt>
            <Gap x={1}/>
            <HelperTooltip tip={protectionInfo.helper} fontSize={16}/>
          </Row>
        </Row>

        <Gap y={1}/>

        <Row>
          <Txt variant="body3">{groupUrl}</Txt>
          <Gap y={1}/>
          <IconButton size='small' onClick={handleCopyClick}>
            <CopyIcon fontSize='small'/>
          </IconButton>
        </Row>

        <Gap y={1}/>

        <Row justifyContent='center'>
          <QRCode value={groupUrl} size={90}/>
        </Row>

        <Gap y={3}/>

        {/* <GroupAvatar group={group} size={40} /> */}
        <Row width='100%' justifyContent='center'>
          <Button variant='contained' onClick={handleCloseClick}>
            {t("close")}
          </Button>
        </Row>
      </Col>
    </Dialog>
  );
}