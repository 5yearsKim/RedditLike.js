"use client";

import React, { useEffect, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
// import { GroupThemeProvider } from "@/ui/tools/GroupThemeProvider";
import { Button } from "@mui/material";
import { Center, Gap, Col } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { RetryIcon, InfoIcon } from "@/ui/icons";
import { useGroup$, useGroupActions } from "@/stores/GroupStore";
import { useSnackbar } from "@/hooks/Snackbar";
import { InitBox, LoadingBox } from "@/components/$statusTools";
import { FRONT_URL_SUFFIX } from "@/config";
import type { GroupT } from "@/types";

type GroupProviderProps = {
  groupKey: string;
  children: ReactNode;
}

export function GroupProvider({
  groupKey,
  children,
}: GroupProviderProps): ReactNode {
  const t = useTranslations("components.$providers.GroupProvider");

  const router = useRouter();

  const group$ = useGroup$();
  const groupAct = useGroupActions();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (group$.status != "loaded" || group$.data?.group.key != groupKey) {
      init();
    }
  }, [groupKey]);

  async function init() {
    groupAct.initFromKey(
      groupKey,
      { onSuccess: onInitSuccess, onFail: onInitFail },
    );
  }

  function onInitSuccess(group: GroupT): void {
    enqueueSnackbar(t("loadSuccess", { groupName: group.name }), { variant: "success" });
  }

  function onInitFail(): void {
    enqueueSnackbar(t("loadFail"), { variant: "error" });
  }

  function handleErrorRetry(): void {
    groupAct.set({ status: "init", data: undefined });
    router.replace("/");

  }

  const { status } = group$;

  if (status == "init") {
    return <InitBox height="80vh"/>;
  }
  if (status == "loading") {
    return <LoadingBox height="80vh" message={t("loadingGroup")}/>;
  }
  if (status == "error") {
    // group error page
    return (
      <Center width='100%' height='80vh'>
        <Col alignItems='center'>
          <InfoIcon sx={{ fontSize: 50, color: "vague.main" }}/>

          <Gap y={2}/>

          <Txt>{t("groupFindFailed", { groupDomain: `${groupKey}.${FRONT_URL_SUFFIX}` })}</Txt>

          <Gap y={4}/>

          <Button
            variant='contained'
            startIcon={<RetryIcon/>}
            onClick={handleErrorRetry}
          >
            {t("retry")}
          </Button>
        </Col>
      </Center>
    );
  }
  return children;
}