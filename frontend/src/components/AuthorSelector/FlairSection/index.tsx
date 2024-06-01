import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Box, Divider, CircularProgress } from "@mui/material";
import { InitBox, ErrorBox } from "@/components/$statusTools";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { FlairBoxItem } from "./FlairBoxItem";
// logic
import { useEffect } from "react";
import { useListData } from "@/hooks/ListData";
import * as FlairBoxApi from "@/apis/flair_boxes";
import type { FlairT, FlairBoxT, ListFlairBoxOptionT } from "@/types";

export type FlairSectionProps = {
  isManager?: boolean;
  boardId: idT;
  selected: FlairT[];
  onFlairSelect: (flair: FlairT, box: FlairBoxT) => any;
};

export function FlairSection({
  isManager,
  boardId,
  selected,
  onFlairSelect,
}: FlairSectionProps): JSX.Element {
  const t = useTranslations("components.AuthorSelector.FlairSection");

  const { data: flairBoxes$, actions: flairBoxesAct } = useListData({
    listFn: FlairBoxApi.list,
  });

  const listOpt: ListFlairBoxOptionT = {
    $flairs: true,
    $custom_flairs: true,
    boardId,
  };

  useEffect(() => {
    flairBoxesAct.load(listOpt);
  }, [listOpt.boardId]);

  function handleErrorRetry(): void {
    flairBoxesAct.load(listOpt, { force: true });
  }

  function handleBoxUpdated(box: FlairBoxT): void {
    flairBoxesAct.replaceItem(box);
  }

  const { status, data: flairBoxes } = flairBoxes$;


  if (status == "init") {
    return <InitBox />;
  }
  if (status == "loading") {
    return <CircularProgress />;
  }
  if (status == "error") {
    return <ErrorBox onRetry={handleErrorRetry} />;
  }


  return (
    <Fragment>
      {flairBoxes.map((box) => {
        return (
          <Box
            my={4}
            key={box.id}
          >
            <Row justifyContent='space-between'>
              <Txt variant='h6'>{box.name}</Txt>
              {box.is_multiple && (
                <Row justifyContent='flex-end'>
                  <Txt
                    color='vague.main'
                    fontSize='small'
                  >
                    *{t("multipleSelect")}
                  </Txt>
                </Row>
              )}
            </Row>
            <Divider />

            <Gap y={1} />

            <Txt color='vague.main'>{box.description}</Txt>
            <Gap y={1} />
            <Box
              margin='auto'
              maxWidth='300px'
            >
              <FlairBoxItem
                isManager={isManager}
                box={box}
                selected={selected}
                onFlairSelect={onFlairSelect}
                onBoxUpdated={handleBoxUpdated}
              />
            </Box>
          </Box>
        );
      })}
    </Fragment>
  );
}
