import React from "react";
import { HoverableBox } from "@/ui/tools/HoverableBox";
import { useResponsive } from "@/hooks/Responsive";
import { Row, Col, Gap } from "@/ui/layouts";
import { Skeleton } from "@mui/material";

type BoardPreviewSkeletonProps = {
  contentCnt: number;
};

export function BoardPreviewSkeleton(props: BoardPreviewSkeletonProps): JSX.Element {
  const { contentCnt } = props;
  const { downSm } = useResponsive();

  return (
    <HoverableBox
      bgcolor='paper.main'
      borderRadius={1}
      py={downSm ? 1 : 2}
      px={downSm ? 2 : 2}
      my={downSm ? 1 : 1}
    >
      {/* first line */}
      <Row height={34}>
        <Skeleton
          variant='circular'
          width={24}
          height={24}
        />
        <Gap x={1} />
        <Skeleton
          variant='text'
          width={70}
          height={24}
        />
      </Row>

      {/* description */}
      <Skeleton
        variant='text'
        width='100%'
        height={40}
      />

      <Gap y={1} />

      <Col
        width='100%'
        rowGap={1}
      >
        {new Array(contentCnt).fill(0).map((_, idx) => {
          return (
            <Skeleton
              key={idx + _}
              variant='rounded'
              width='100%'
              height={45}
            />
          );
        })}
      </Col>

      <Row justifyContent='flex-end'>
        <Skeleton
          variant='text'
          width={30}
        />
      </Row>
    </HoverableBox>
  );
}
