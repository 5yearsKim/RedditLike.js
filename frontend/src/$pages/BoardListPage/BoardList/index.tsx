"use client";
import React, { useEffect, Fragment } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useResponsive } from "@/hooks/Responsive";
import { Masonry } from "@mui/lab";
import { Box, Row, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CloseIcon } from "@/ui/icons";
import { ViewObserver } from "@/ui/tools/ViewObserver";
import { InitBox, ErrorBox } from "@/components/$statusTools";
import { useAllBoardsStore } from "@/stores/AllBoardsStore";
import type { ListBoardOptionT } from "@/types/Board";
import { BoardPreviewSkeleton, BoardPreview } from "./BoardPreview";

type BoardListProps = {
  listOpt: ListBoardOptionT;
  regenCnt?: number
}

export function BoardList({
  listOpt,
  regenCnt,
}: BoardListProps) {
  const t = useTranslations("pages.BoardListPage.BoardList");
  const { data: boards$, actions: boardsAct } = useAllBoardsStore();

  const { status, data: boards, appendingStatus } = boards$;

  const { downSm } = useResponsive();


  useEffect(() => {
    boardsAct.load(listOpt);
  }, [JSON.stringify(listOpt)]);

  useEffect(() => {
    if (regenCnt) {
      // regenCnt exsts and regenCnt > 0
      boardsAct.load(listOpt, { force: true });
    }
  }, [regenCnt]);

  function handleLoaderDetect(): void {
    boardsAct.refill();
  }

  function handleErrorRetry(): void {
    boardsAct.load(listOpt, { force: true });
  }

  if (status === "init") {
    return <InitBox height='60vh' />;
  }

  if (status === "loading") {
    return (
      <Box sx={{ marginRight: downSm ? -1 : -2 }}>
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3 }}
          spacing={downSm ? 1 : 2}
          sx={{ width: "100%" }}
        >
          {new Array(6).fill(0).map((_, idx) => (
            <Fragment key={_ + idx}>
              <BoardPreviewSkeleton contentCnt={downSm ? 3 : 8 - (idx % 4)} />
            </Fragment>
          ))}
        </Masonry>
      </Box>
    );
  }

  if (status === "error") {
    return (
      <ErrorBox
        height='60vh'
        showHome
        onRetry={handleErrorRetry}
      />
    );
  }

  if (boards.length === 0) {
    return (
      <Center
        width='100%'
        height='50px'
      >
        <Row>
          <CloseIcon sx={{ color: "vague.main", mr: 1 }} />
          <Txt color='vague.main' variant='subtitle2'>{t("noBoards")}</Txt>
        </Row>
      </Center>
    );
  }
  return (
  // mui right padding bug walkaround
    <Box sx={{ marginRight: downSm ? -1 : -2 }}>
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3 }}
        spacing={downSm ? 1 : 2}
        sx={{ width: "100%" }}
      >
        {boards.map((board) => (
          <Fragment key={board.id}>
            <Link
              className='no-highlight'
              href={`/boards/${board.id}`}
            >
              <BoardPreview
                key={board.id}
                board={board}
              />
            </Link>
          </Fragment>
        ))}
        {/* <div> span </div> */}

        <ViewObserver
          onDetect={handleLoaderDetect}
          monitoringArgs={[boards]}
        >
          <div
            style={{
              visibility: appendingStatus == "loading" ? "visible" : "hidden",
            }}
          >
            <BoardPreviewSkeleton contentCnt={3} />
          </div>
        </ViewObserver>
      </Masonry>
    </Box>
  );
}