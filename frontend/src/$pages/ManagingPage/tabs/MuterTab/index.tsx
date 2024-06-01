"use client";
import React, { Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { ListView } from "@/ui/tools/ListView";
import { Container, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CloseIcon } from "@/ui/icons";
import { MuterItem } from "./MuterItem";
import { NoRightIndicator } from "../../NoRightIndicator";
// logic
import { useEffect } from "react";
import * as BoardMuterApi from "@/apis/board_muters";
import { useListData } from "@/hooks/ListData";
import { useBoardMain$ } from "@/stores/BoardMainStore";
import type { BoardMuterT, ListBoardMuterOptionT } from "@/types";

export function MuterTab(): ReactNode {
  const t = useTranslations("pages.ManagingPage.MuterTab");

  const boardMain$ = useBoardMain$();

  const { board, manager } = boardMain$.data!;

  const { data: boardMuter$, actions: boardMuterAct } = useListData({
    listFn: BoardMuterApi.list,
  });

  const listOpt: ListBoardMuterOptionT = {
    $author: true,
    boardId: board.id,
  };

  useEffect(() => {
    boardMuterAct.load(listOpt);
  }, []);

  function handleErrorRetry(): void {
    boardMuterAct.load(listOpt, { force: true });
  }

  function handleMuterDeleted(muter: BoardMuterT): void {
    boardMuterAct.filterItems((item) => item.id !== muter.id);
  }

  function handleLoaderDetect(): void {
    boardMuterAct.refill();
  }


  const { status, data: muters } = boardMuter$;

  function renderMuters(): JSX.Element {
    if (status === "init") {
      return <InitBox />;
    }
    if (status === "loading") {
      return <LoadingBox />;
    }
    if (status === "error") {
      return <ErrorBox onRetry={handleErrorRetry} />;
    }
    if (muters.length == 0) {
      return (
        <Row
          mt={3}
          justifyContent='center'
        >
          <CloseIcon sx={{ color: "vague.main" }} />
          <Gap x={1} />
          <Txt
            variant='subtitle1'
            color='vague.main'
          >
            {t("noRestrictedUser")}
          </Txt>
        </Row>
      );
    }

    return (
      <ListView
        data={muters}
        onLoaderDetect={handleLoaderDetect}
        renderItem={(item): JSX.Element => {
          return (
            <Fragment key={item.id}>
              <MuterItem
                muter={item as BoardMuterT}
                onDeleted={handleMuterDeleted}
              />
            </Fragment>
          );
        }}
      />
    );
  }

  if (!manager?.manage_muter) {
    return <NoRightIndicator title={t("boardRestriction")} />;
  }

  return (
    <Container rtlP>
      <Txt variant='h5'>{t("boardRestriction")}</Txt>

      <Gap y={2} />

      <Txt color='vague.main'>{t("boardRestrictionHelper")}</Txt>

      <Gap y={2} />

      {renderMuters()}
    </Container>
  );
}
