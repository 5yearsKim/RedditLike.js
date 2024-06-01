"use client";
import React, { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Row, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Divider, Switch } from "@mui/material";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";
import { LoadingBox, ErrorBox } from "@/components/$statusTools";
import { PushNotiSection } from "./PushNotiSection";
import { NotiSwitch } from "./NotiSwitch";
// logic
import * as UserApi from "@/apis/users";
import { useSnackbar } from "@/hooks/Snackbar";
import { useUser$, useUserActions } from "@/stores/UserStore";
import type { UserFormT } from "@/types";


export function NotificationTab(): JSX.Element {
  const t = useTranslations("pages.SettingPage.NotificationTab");
  const { enqueueSnackbar } = useSnackbar();
  const user$ = useUser$();
  const userAct = useUserActions();

  async function handleUserUpdate(data: Partial<UserFormT>): Promise<void> {
    try {
      const updated = await UserApi.updateMe(data);
      userAct.patchData({ me: updated });
      enqueueSnackbar("변경되었어요.", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("업데이트에 실패했어요.", { variant: "error" });
    }
  }


  const { status , data } = user$!;

  if (status == "init" || status == "loading") {
    return <LoadingBox/>;
  }
  if (status == "error") {
    return <ErrorBox message={t("userOnly")}/>;
  }

  const { me } = data!;

  return (
    <>
      <Txt variant='h5'>{t("notificationSetting")}</Txt>

      {/* <Gap y={4} />

      <Txt variant='h6'>푸시 알림</Txt>
      <Divider />
      <Gap y={2} />

      <PushNotiSection /> */}

      <Gap y={4} />

      <Txt variant='h6'>{t("notificationDetail")}</Txt>
      <Divider />
      <Gap y={2} />

      {/* <NotiSwitch
        label='채팅 푸시 알림'
        checked={Boolean(me?.allow_chat_push)}
        onChange={(e): any => handleUserUpdate({ allow_chat_push: e.target.checked })}
      />

      <Gap y={2} /> */}

      <NotiSwitch
        label={t("commentOnPost")}
        checked={Boolean(me?.notify_comment_on_post)}
        onChange={(e): any => handleUserUpdate({ notify_comment_on_post: e.target.checked })}
      />
      <NotiSwitch
        label={t("commentOnComment")}
        checked={Boolean(me?.notify_comment_on_comment)}
        onChange={(e): any => handleUserUpdate({ notify_comment_on_comment: e.target.checked })}
      />
      <NotiSwitch
        label={t("postHidden")}
        helper={t("postHiddenHelper")}
        checked={Boolean(me?.notify_trash_post)}
        onChange={(e): any => handleUserUpdate({ notify_trash_post: e.target.checked })}
      />
      <NotiSwitch
        label={t("commentHidden")}
        helper={t("commentHiddenHelper")}
        checked={Boolean(me?.notify_trash_comment)}
        onChange={(e): any => handleUserUpdate({ notify_trash_comment: e.target.checked })}
      />
    </>
  );
}

