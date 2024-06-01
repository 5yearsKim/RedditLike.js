import React from "react";
import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import { ListView, AppendLoading, AppendError } from "@/ui/tools/ListView";
import { Txt } from "@/ui/texts";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { BoardPreview } from "@/components/BoardPreview";

import { useEffect } from "react";
import { useListData } from "@/hooks/ListData";
import * as BoardApi from "@/apis/boards";
import type { ListBoardOptionT } from "@/types";
import type { BoardT } from "@/types";

type BoardListProps = {
  listOption: ListBoardOptionT;
  regenCnt?: number;
  renderItem?: (item: BoardT) => JSX.Element;
};


export function BoardList({
  listOption: listOpt,
  regenCnt,
  renderItem,
}: BoardListProps): JSX.Element {
  const t = useTranslations("components.BoardList");

  const { data: boards$, actions: boardsAct } = useListData<BoardT, ListBoardOptionT>({
    listFn: BoardApi.list,
  });

  useEffect(() => {
    boardsAct.load(listOpt);
  }, [JSON.stringify(listOpt), regenCnt]);

  function handleErrorRetry(): void {
    boardsAct.load(listOpt, { force: true });
  }

  function handleLoaderDetect(): void {
    boardsAct.refill();
  }

  function handleRefillRetry(): void {
    boardsAct.refill();
  }


  const { status, data: boards, appendingStatus } = boards$;
  if (status === "init") {
    return <InitBox height='60vh' />;
  }
  if (status === "loading") {
    return <LoadingBox height='60vh' />;
  }
  if (status === "error") {
    return (
      <ErrorBox
        height='60vh'
        onRetry={handleErrorRetry}
      />
    );
  }

  if (boards.length == 0) {
    return (
      <Box>
        <Txt
          variant='subtitle2'
          color='vague.main'
          textAlign='center'
        >
          {t("noBoard")}
        </Txt>
      </Box>
    );
  }
  return (
    <ListView
      data={boards}
      onLoaderDetect={handleLoaderDetect}
      renderItem={
        renderItem
          ? renderItem
          : (item): JSX.Element => {
            return (
              <BoardPreview
                board={item}
                selected={Boolean(item.follower)}
              />
            );
          }
      }
      renderAppend={(): JSX.Element => {
        if (appendingStatus === "loading") {
          return <AppendLoading />;
        }
        if (appendingStatus === "error") {
          return <AppendError onRetry={handleRefillRetry} />;
        }
        return <></>;
      }}
    />
  );
}
