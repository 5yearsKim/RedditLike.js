import React from "react";
import { Box, Skeleton } from "@mui/material";
import { Row, Expand, Gap } from "@/ui/layouts";

export function PostPreviewSkeletonSM(): JSX.Element {
  return (
    <Box
      mx={-2}
      px={2}
      py={1}
      bgcolor='paper.main'
    >
      {/* first line */}
      <Row
        width='100%'
        height='1.4rem'
      >
        <Skeleton
          variant='circular'
          width={20}
          height={18}
        />
        <Gap x={1} />
        <Skeleton
          variant='text'
          width={80}
          height={18}
        />
      </Row>

      <Box mt={0} />
      {/* title */}
      <Skeleton
        variant='text'
        width={"100%"}
        height={26}
      />

      <Box mt={0.5} />

      {/* body */}
      <Skeleton
        variant='rounded'
        width='100%'
        height={34}
      />

      <Gap y={1} />

      {/* last line */}
      <Row>
        <Skeleton
          variant='text'
          width={60}
          height={24}
        />
        <Expand />
        <Skeleton
          variant='text'
          width={60}
          height={24}
        />
      </Row>
    </Box>
  );
}
