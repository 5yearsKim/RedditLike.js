"use client";
import React, { Fragment, ReactNode, useMemo } from "react";
import { useTranslations } from "next-intl";
import { IconButton, Popover, Badge, Button } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { Col, Box, Center, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { NotificationIcon } from "@/ui/icons";
import { NotificationItem } from "@/components/NotificationItem";
import { Tooltip } from "@/ui/tools/Tooltip";
import { ListView, AppendLoading } from "@/ui/tools/ListView";
import { NotificationEventProvider } from "./event_provider";
// logic
import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useUrlState } from "@/hooks/UrlState";
import { useMe } from "@/stores/UserStore";
import { useNotificationsStore, getNotificationsListOpt } from "@/stores/NotificationsStore";
import * as NotificationApi from "@/apis/notifications";


export function NotificationBox(): ReactNode {
  const t = useTranslations("components.Navbar.NavbarActions.NotificationBox");
  const router = useRouter();
  const me = useMe();
  const { data: notifications$, actions: notificationsAct } = useNotificationsStore();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notiOpen, setNotiOpen] = useUrlState<boolean>({
    key: "notiBox",
    val2query: (val) => val ? "true" : null,
    query2val: (query) => query == "true",
    backOn: (val) => !val,
  });

  const listOpt = getNotificationsListOpt({ userId: me?.id });
  function _checkAll(): void {
    if (notifications$.data.some((item) => !item.is_checked)) {
      NotificationApi.checkUnread()
        .then(() => {
          notificationsAct.load(listOpt, { force: true });
        })
        .catch((e) => console.warn(e));
    }
  }

  function handleNotiClick(e: MouseEvent<HTMLButtonElement>): void {
    notificationsAct.load(listOpt, { force: true, skipLoading: true });
    setAnchorEl(e.currentTarget);
    setNotiOpen(true);
  }

  function handleClose(): void {
    _checkAll();
    setNotiOpen(false);
  }

  function handleLoaderDetect(): void {
    if (notifications$.status == "loaded") {
      notificationsAct.refill();
    }
  }

  function handleSeeAllClick(): void {
    router.replace("/notifications");
    _checkAll();
  }


  const { status, data: notifications, appendingStatus } = notifications$;

  const { downMd, downSm } = useResponsive();

  const unreadCnt = useMemo(() => {
    let cnt = 0;
    notifications$.data.forEach((item) => {
      if (!item.is_checked) {
        cnt++;
      }
    });
    return cnt;
  }, [notifications]);

  return (
    <NotificationEventProvider>
      <Tooltip title={t("notification")}>
        <IconButton
          aria-label='notification'
          size={downSm ? "small" : "medium"}
          onClick={handleNotiClick}
        >
          <Badge
            color='secondary'
            badgeContent={unreadCnt}
          >
            <NotificationIcon sx={{ color: "vague.light" }} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={notiOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: downMd ? "left" : "center",
          vertical: "bottom",
        }}
        onClose={handleClose}
        disableScrollLock
        // sx={{
        //   maxHeight:'600px',
        // }}
      >
        <Box
          width={downMd ? "250px" : "350px"}
          display='flex'
          flexDirection='column'
          pt={1}
          maxHeight={downMd ? "450px" : "600px"}
          sx={{
            overflowY: "auto",
          }}
        >
          <Box ml={2}>
            <Txt variant='h6'>{t("notification")}</Txt>
          </Box>

          <Gap y={1} />

          {status == "loaded" && notifications.length == 0 && (
            <Center>
              <Txt color='vague.main' variant='body3'>{t("noNotification")}</Txt>
            </Center>
          )}

          <Col>
            <ListView
              data={notifications}
              onLoaderDetect={handleLoaderDetect}
              renderItem={(noti): JSX.Element => {
                return (
                  <Fragment key={noti.id}>
                    <NotificationItem
                      notification={noti}
                      onClick={handleClose}
                    />
                  </Fragment>
                );
              }}
              renderAppend={(): JSX.Element => {
                if (appendingStatus === "loading") {
                  return <AppendLoading />;
                }
                return <div />;
              }}
            />
          </Col>
        </Box>
        <Box
          position='sticky'
          bottom={0}
          width='100%'
        >
          <Button
            onClick={handleSeeAllClick}
            fullWidth
            size='small'
          >
            {t("showAll")}
          </Button>
        </Box>
      </Popover>
    </NotificationEventProvider>
  );
}
