"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@mui/material";
import { Row, Gap, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { InitBox, LoadingIndicator, ErrorBox } from "@/components/$statusTools";
import { BoardNameItem } from "@/components/BoardNameItem";
import { ListView, AppendLoading, AppendError } from "@/ui/tools/ListView";
// logic
import { useEffect } from "react";
import { useListData } from "@/hooks/ListData";
import { useSnackbar } from "@/hooks/Snackbar";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import * as BoardApi from "@/apis/boards";
import * as BoardBlockApi from "@/apis/board_blocks";
import type { BoardT, ListBoardOptionT } from "@/types";


export function BlockedBoardSection(): JSX.Element {
  const t = useTranslations("pages.SettingPage.BoardTab.BlockedBoardSection");
  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();

  const { data: blockedBoards$, actions: blockedBoardsAct } = useListData({
    listFn: BoardApi.list,
  });

  const listOpt: ListBoardOptionT = {
    block: "only",
    censor: "exceptTrashed",
    $user_defaults: true,
  };

  useEffect(() => {
    blockedBoardsAct.load(listOpt);
  }, []);

  function handleLoaderDetect(): void {
    blockedBoardsAct.refill();
  }

  function handleAppendingRetry(): void {
    blockedBoardsAct.refill();
  }

  async function handleUnblockBoard(board: BoardT): Promise<void> {
    if (!board.block) {
      return; // throw error
    }
    const isOk = await showAlertDialog({
      title: `${board.name} ${t("unblockBoard")}`,
      body: t("unblockBoardMsg"),
      useOk: true,
      useCancel: true,
      themeDisabled: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await BoardBlockApi.remove(board.block.id);
      blockedBoardsAct.filterItems((item) => item.id !== board.id);
      enqueueSnackbar(t("unblockBoardSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("unblockBoardFailed"), { variant: "error" });
    }
  }

  const { status, appendingStatus, data: boards } = blockedBoards$;

  function renderBoardList(): JSX.Element {
    if (status === "init") {
      return <InitBox />;
    }
    if (status === "loading") {
      return <LoadingIndicator />;
    }
    if (status === "error") {
      return <ErrorBox />;
    }
    if (boards.length == 0) {
      return (
        <Txt
          color='vague.main'
          fontWeight={500}
        >
          {t("noBlockedBoard")}
        </Txt>
      );
    }
    return (
      <ListView
        data={boards}
        onLoaderDetect={handleLoaderDetect}
        renderItem={(item): JSX.Element => {
          return (
            <Fragment key={"board-" + item.id}>
              <Row my={1}>
                <Box minWidth={220} display='flex'>
                  <BoardNameItem board={item} />
                </Box>
                <Gap x={2} />
                <Button
                  variant='outlined'
                  size='small'
                  onClick={(): Promise<void> => handleUnblockBoard(item)}
                >
                  {t("unblockBoard")}
                </Button>
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
    );
  }

  return (
    <Fragment>
      <Gap y={4} />
      {renderBoardList()}
    </Fragment>
  );
}
