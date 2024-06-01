import React from "react";
import { Box } from "@mui/material";
import { Col, Row, Gap } from "@/ui/layouts";

type MainWithPannelsProps = {
  main: JSX.Element;
  pannels: JSX.Element[];
  gap?: number;
  pannelGap?: number;
};

export function MainWithPannels({
  main,
  pannels,
  gap,
  pannelGap,
}: MainWithPannelsProps): JSX.Element {
  return (
    <Row alignItems='flex-start'>
      <Box flex={2} maxWidth='66%'>
        {main}
      </Box>

      {gap &&
        <Box mr={gap} />
      }

      <Col flex={1} rowGap={pannelGap} maxWidth='33%'>
        {pannels.map((pannel, idx) => (
          <div key={idx}>{pannel}</div>
        ))}

        <Gap y={8} />

      </Col>
    </Row>
  );
}