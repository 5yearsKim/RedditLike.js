"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Container, Gap, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { AddManagerButton } from "./AddManagerButton";
import { ManagerItem } from "./ManagerItem";
// logic
import { useEffect } from "react";
import { useBoardMain$ } from "@/stores/BoardMainStore";
import { useListData } from "@/hooks/ListData";

import * as BoardManagerApi from "@/apis/board_managers";
import type { BoardManagerT, ListBoardManagerOptionT } from "@/types";


export function ManagerTab(): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ManagerTab");
  const boardMain$ = useBoardMain$();
  const { board } = boardMain$.data!;

  const { data: boardManagers$, actions: boardManagersAct } = useListData({
    listFn: BoardManagerApi.list,
  });

  const listOpt: ListBoardManagerOptionT = {
    $author: true,
    boardId: board.id,
  };

  useEffect(() => {
    boardManagersAct.load(listOpt);
  }, []);

  function handleManagerAdded(manager: BoardManagerT): void {
    boardManagersAct.patch({
      data: [...boardManagers$.data, manager],
    });
  }

  function handleManagerUpdated(manager: BoardManagerT): void {
    boardManagersAct.replaceItem(manager);
  }

  function handleManaerDeleted(manager: BoardManagerT): void {
    boardManagersAct.filterItems((item) => item.id !== manager.id);
  }

  function handleErrorRetry(): void {
    boardManagersAct.load(listOpt, { force: true });
  }

  const { status, data: managers } = boardManagers$;

  function renderContents(): JSX.Element {
    if (status == "init") {
      return <InitBox />;
    }
    if (status == "loading") {
      return <LoadingBox />;
    }
    if (status == "error") {
      return <ErrorBox onRetry={handleErrorRetry} />;
    }
    return (
      <>
        {managers.map((manager) => {
          return (
            <Fragment key={manager.id}>
              <ManagerItem
                manager={manager}
                onUpdated={handleManagerUpdated}
                onDeleted={handleManaerDeleted}
              />
            </Fragment>
          );
        })}
      </>
    );
  }

  return (
    <Container rtlP>
      <Row justifyContent='space-between'>
        <Txt variant='h5'>{t("manageManager")}</Txt>

        <AddManagerButton
          boardId={board.id}
          onCreated={handleManagerAdded}
        />
      </Row>

      <Gap y={2} />

      {renderContents()}
    </Container>
  );
}
