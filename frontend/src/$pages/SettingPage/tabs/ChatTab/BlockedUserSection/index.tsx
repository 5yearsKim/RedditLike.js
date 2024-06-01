"use client";
import React, { useEffect, Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@mui/material";
import { Row, Box, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { InitBox, LoadingIndicator, ErrorBox } from "@/components/$statusTools";
import { BoardNameItem } from "@/components/BoardNameItem";
import { BoardAuthor } from "@/components/BoardAuthor";
import { ListView, AppendLoading, AppendError } from "@/ui/tools/ListView";
// logic
import { useListData } from "@/hooks/ListData";
import { useSnackbar } from "@/hooks/Snackbar";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import * as BoardUserBlockApi from "@/apis/board_user_blocks";
import type { ListBoardUserBlockOptionT, BoardUserBlockT } from "@/types";

export function BlockedUserSection(): JSX.Element {
  const t = useTranslations("pages.SettingPage.ChatTab.BlockedUserSection");

  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();

  const { data: blockedUsers$, actions: blockedUsersAct } = useListData({
    listFn: BoardUserBlockApi.list,
  });

  const listOpt: ListBoardUserBlockOptionT = {
    $board: true,
    $target: true,
  };

  useEffect(() => {
    blockedUsersAct.load(listOpt);
  }, []);

  function handleLoaderDetect(): void {
    blockedUsersAct.refill();
  }

  function handleAppendingRetry(): void {
    blockedUsersAct.refill();
  }

  async function handleUnblockUser(blockedUser: BoardUserBlockT): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("unblockUser"),
      body: t("unblockUserMsg"),
      useOk: true,
      useCancel: true,
      themeDisabled: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await BoardUserBlockApi.remove(blockedUser.id);
      blockedUsersAct.filterItems((item) => item.id !== blockedUser.id);
      enqueueSnackbar(t("unblockUserSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("unblockUserFailed"), { variant: "error" });
    }
  }

  const { status, appendingStatus, data: blockedUsers } = blockedUsers$;


  return (
    <Fragment>
      <Gap y={4} />
      {status == "init" && (
        <InitBox />
      )}

      {status == "loading" && (
        <LoadingIndicator/>
      )}

      {status == "error" && (
        <ErrorBox/>
      )}

      {status == "loaded" && blockedUsers.length == 0 && (
        <Txt color='vague.main' fontWeight={500}>{t("noBlockedUser")}</Txt>
      )}

      {status == "loaded" && (
        <ListView
          data={blockedUsers}
          onLoaderDetect={handleLoaderDetect}
          renderItem={(item): JSX.Element => {
            return (
              <Fragment key={"blocked-user-" + item.id}>
                <Row my={0.5}>
                  <Box minWidth='100px'>
                    <BoardAuthor author={item.target ?? null} />
                  </Box>
                  <Button
                    variant='outlined'
                    onClick={(): Promise<void> => handleUnblockUser(item)}
                  >
                    {t("unblockUser")}
                  </Button>
                  <Expand />
                  {item.board && (
                    <BoardNameItem
                      board={item.board}
                      disabled
                    />
                  )}
                </Row>
              </Fragment>
            );
          }}
          renderAppend={(): JSX.Element => {
            if (appendingStatus == "loading") {
              return <AppendLoading />;
            }
            if (appendingStatus == "error") {
              return <AppendError onRetry={handleAppendingRetry} />;
            }
            return <div />;
          }}
        />
      )}
    </Fragment>
  );
}
