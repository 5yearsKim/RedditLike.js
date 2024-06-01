import React from "react";
import { Skeleton, Box } from "@mui/material";
import { Row, Expand, Center, Gap } from "@/ui/layouts";
import { HoverableBox } from "@/ui/tools/HoverableBox";
import { ThumbUpOlIcon, ThumbDownOlIcon } from "@/ui/icons";

export function PostPreviewSkeletonMD(): JSX.Element {
  return (
    <HoverableBox
      bgcolor='paper.main'
      width='100%'
      height='306px'
    >
      <Row height='100%'>
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='flex-start'
          alignItems='center'
          bgcolor='rgba(160, 160, 160, 0.15)'
          width={"34px"}
          height='100%'
        >
          <Gap y={0.5} />
          <ThumbUpOlIcon sx={{ color: "vague.light" }} />
          <Center height='29px'>
            <Skeleton
              variant='rounded'
              width={20}
              height={20}
            />
          </Center>
          <ThumbDownOlIcon sx={{ color: "vague.light" }} />
        </Box>

        <Box
          flex={1}
          display='flex'
          flexDirection='column'
          position='relative'
          width='100%'
          height='100%'
          overflow='hidden'
          py={1}
          px={2}
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
            height={40}
          />
          {/* body */}
          <Skeleton
            variant='rounded'
            width='100%'
            height={198}
          />
          <Expand />
          {/* last line */}
          <Row>
            <Skeleton
              variant='text'
              width={50}
              height={24}
            />
            <Expand />
            <Skeleton
              variant='text'
              width={50}
              height={24}
            />
          </Row>
        </Box>
      </Row>
    </HoverableBox>
  );
}
