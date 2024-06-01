import React from "react";
import { useLocale } from "next-intl";
import { GroupOlIcon } from "@/ui/icons";
import { Row, Col, Gap } from "@/ui/layouts";
import { EllipsisTxt, Txt } from "@/ui/texts";
import { BoardAvatar } from "@/ui/tools/Avatar";
import { StarIcon } from "@/ui/icons";
import { shortenNumber } from "@/utils/formatter";
import type { BoardT } from "@/types";

type BoardSearchItemProps = {
  board: BoardT;
};

export function BoardSearchItem({ board }: BoardSearchItemProps): JSX.Element {
  const locale = useLocale();

  return (
    <Row>
      <BoardAvatar
        board={board}
        size='28px'
      />
      <Gap x={1} />
      <Col>
        <Row width='100%'>
          <EllipsisTxt
            variant='body2'
            maxLines={1}
          >
            {board.name}
          </EllipsisTxt>
          {Boolean(board.num_follower) && (
            <Row
              ml={1}
              alignSelf='flex-end'
            >
              <GroupOlIcon sx={{ fontSize: 14, color: "vague.light" }} />
              <Txt
                variant='body3'
                color='vague.light'
              >
                {shortenNumber(board.num_follower, { locale })}
              </Txt>
            </Row>
          )}
          {Boolean(board.follower) && (
            <StarIcon
              sx={{ fontSize: 14, mx: 0.5, color: "yellow.main" }}
            />
          )}
        </Row>
        <EllipsisTxt
          variant='body2'
          maxLines={1}
          color='vague.main'
        >
          {board.description}
        </EllipsisTxt>
      </Col>
    </Row>
  );
}
