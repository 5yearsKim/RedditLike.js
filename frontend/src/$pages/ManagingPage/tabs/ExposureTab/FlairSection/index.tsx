import React, { Fragment, ReactNode } from "react";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { Row, Box } from "@/ui/layouts";
import { FlairBoxItem } from "./FlairBoxItem";
import { AddFlairBox } from "./AddFlairBox";
// logic
import { useEffect } from "react";
import { useListData } from "@/hooks/ListData";
import * as BoardFlairBoxApi from "@/apis/flair_boxes";
import type { BoardT, FlairBoxT, ListFlairBoxOptionT } from "@/types";

type FlairSectionProps = {
  board: BoardT;
};

export function FlairSection({
  board,
}: FlairSectionProps): ReactNode {

  const { data: flairBoxes$, actions: flairBoxesAct } = useListData({
    listFn: BoardFlairBoxApi.list,
  });

  const { status, data: flairBoxes } = flairBoxes$;

  const listOpt: ListFlairBoxOptionT = { boardId: board.id, $flairs: true };
  useEffect(() => {
    flairBoxesAct.load(listOpt);
  }, [listOpt.boardId]);

  async function handleErrorRetry(): Promise<void> {
    flairBoxesAct.load(listOpt, { force: true });
  }

  async function handleFlairBoxCreated(): Promise<void> {
    flairBoxesAct.load(listOpt, { force: true, skipLoading: true });
  }

  function handleFlairBoxUpdated(updated: FlairBoxT): void {
    if (!flairBoxes) {
      return;
    }
    flairBoxesAct.replaceItem(updated);
  }

  // eslint-disable-next-line
  async function handleFlairBoxDeleted(deletedId: idT): Promise<void> {
    if (!flairBoxes) {
      return;
    }
    flairBoxesAct.load(listOpt, { force: true, skipLoading: true });
  }


  if (status === "init") {
    return <InitBox />;
  }
  if (status === "loading") {
    return <LoadingBox />;
  }
  if (status === "error") {
    return <ErrorBox onRetry={handleErrorRetry} />;
  }

  return (
    <Fragment>
      {flairBoxes.map((fbox) => {
        return (
          <Box
            key={fbox.id}
            py={1}
          >
            <FlairBoxItem
              flairBox={fbox}
              onUpdated={handleFlairBoxUpdated}
              onDeleted={handleFlairBoxDeleted}
            />
          </Box>
        );
      })}
      {flairBoxes.length < 2 && (
        <Row justifyContent='center'>
          <AddFlairBox
            board={board}
            onCreated={handleFlairBoxCreated}
          />
        </Row>
      )}
    </Fragment>
  );
}
