import React from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Row, Box, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardAvatar } from "@/ui/tools/Avatar";
import { HoverableBox } from "@/ui/tools/HoverableBox";
import { StarIcon } from "@/ui/icons";
import { shortenNumber } from "@/utils/formatter";
import type { BoardT } from "@/types";

export const BoardPreview = React.memo(_BoardPreview);
// export const BoardPreview = View;


export type BoardPreviewProp = {
  board: BoardT;
  selected: boolean;
  disableRouting?: boolean;
};

export function _BoardPreview({
  board,
  selected,
  disableRouting,
}: BoardPreviewProp): JSX.Element {
  const locale = useLocale();
  const router = useRouter();

  function handleClick(): void {
    if (disableRouting !== true) {
      router.push(`/boards/${board.id}`);
    }
  }

  return (
    <HoverableBox
      onClick={handleClick}
      bgcolor='paper.main'
      width='100%'
      borderRadius={1}
      px={2}
      py={1}
      mb={1}
    >
      <Row>
        <BoardAvatar board={board} />
        <Gap x={2} />
        <Expand>
          <Row>
            <Expand>
              <Txt
                variant='subtitle2'
                fontWeight={700}
              >
                {board.name}
              </Txt>
            </Expand>

            <Box>
              <Row>
                <StarIcon
                  fontSize='small'
                  sx={{ color: selected ? "yellow.main" : "vague.main" }}
                />
                <Box mr={0.5} />
                <Txt
                  color='vague.main'
                  variant='body2'
                  fontWeight={700}
                >
                  {shortenNumber(board.num_follower, { locale })}
                </Txt>
              </Row>
            </Box>
          </Row>
          <Txt
            overflow='hidden'
            textOverflow='ellipsis'
            sx={{
              color: "vague.main",
              display: "-webkit-box",
              lineClamp: 2,
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {board.description}
          </Txt>
        </Expand>
      </Row>
    </HoverableBox>
  );
}
