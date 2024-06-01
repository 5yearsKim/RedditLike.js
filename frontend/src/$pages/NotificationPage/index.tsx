"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Container, Col, Gap, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Box, Divider } from "@mui/material";
import { NotificationItem } from "@/components/NotificationItem";

import { useEffect } from "react";
import { useMe } from "@/stores/UserStore";
import { useNotificationsStore, getNotificationsListOpt } from "@/stores/NotificationsStore";


export function NotificationPage(): JSX.Element {
  const t = useTranslations("pages.NotificationPage");
  const me = useMe();
  const { data: notifications$, actions: notificationsAct } = useNotificationsStore();

  const listOpt = getNotificationsListOpt({ userId: me?.id });

  useEffect(() => {
    notificationsAct.load(listOpt);
  }, []);


  return (
    <Container
      maxWidth='sm'
      rtlP
    >
      <Txt variant='h5'>{t("notification")}</Txt>

      <Gap y={2} />

      {notifications$.status == "loaded" && notifications$.data.length == 0 && (
        <Row justifyContent='center' p={2}>
          <Txt variant='body2' color='vague.main'>{t("noNotification")}</Txt>
        </Row>
      )
      }

      <Box
        bgcolor='paper.main'
        borderRadius={2}
        boxShadow={2}
        overflow='clip'
      >
        <Col divider={<Divider />}>
          {notifications$.data.map((item) => {
            return (
              <Fragment key={`notification-${item.id}`}>
                <NotificationItem notification={item} />
              </Fragment>
            );
          })}
        </Col>
      </Box>
    </Container>
  );
}
