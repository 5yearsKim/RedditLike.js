"use client";

import React, { Fragment, useEffect } from "react";
import { useTranslations } from "next-intl";
import * as BoardApi from "@/apis/boards";
import { useListData } from "@/hooks/ListData";
import { ListView } from "@/ui/tools/ListView";
import { Row, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Button } from "@mui/material";
import { useSnackbar } from "@/hooks/Snackbar";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { BoardSearchItem } from "@/components/BoardSearchItem";
import { useGroup } from "@/stores/GroupStore";
import type { ListBoardOptionT, BoardT } from "@/types";

export function TrashedBoardList() {
  const t = useTranslations("pages.AdminPage.CensorTab.TrashedBoardList");

  const group = useGroup();
  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();

  const { data: boards$, actions: boardsAct } = useListData({
    listFn: BoardApi.list,
  });

  const listOpt: ListBoardOptionT = {
    groupId: group.id,
    censor: "trashed",
  };

  useEffect(() => {
    boardsAct.load(listOpt);
  }, []);

  function handleErrorRetry(): void {
    boardsAct.load(listOpt, { force: true });
  }
  function handleLoaderDetect(): void {
    boardsAct.refill();
  }

  async function handleRestoreClick(board: BoardT): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("restoreBoard"),
      body: t("restoreBoardMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    try {
      const updated = await BoardApi.adminRestore(board.id);
      enqueueSnackbar(t("restoreBoardSuccess"), { variant: "success" });
      boardsAct.filterItems((item) => item.id != updated.id);
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("restoreBoardFailed"), { variant: "error" });
    }

  }

  const { data: boards, status } = boards$;

  if (status == "init" ) {
    return (
      <InitBox />
    );
  }
  if (status == "loading") {
    return (
      <LoadingBox/>
    );
  }
  if (status == "error") {
    return (
      <ErrorBox onRetry={handleErrorRetry}/>
    );
  }

  return (
    <>
      {boards.length == 0 && (
        <Box textAlign='center' my={2}>
          <Txt color='vague.main'>{t("noTrashedBoards")}</Txt>
        </Box>
      )}
      <ListView
        data={boards}
        onLoaderDetect={handleLoaderDetect}
        renderItem={(board) => {
          return (
            <Fragment key={board.id}>
              <Row my={1}>
                <Box minWidth={200}>
                  <BoardSearchItem board={board}/>
                </Box>
                <Button
                  variant='contained'
                  onClick={() => handleRestoreClick(board)}
                >
                  {t("restore")}
                </Button>
              </Row>
            </Fragment>
          );
        }}
      />
    </>
  );
}
