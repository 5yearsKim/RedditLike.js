import React from "react";
import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Col } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

type InitBoxProps = {
  height?: string;
};

export function InitBox({
  height,
}: InitBoxProps): JSX.Element {

  return (
    <Box
      width='100%'
      height={height ?? "100%"}
    >
      <Col
        alignItems='center'
        justifyContent='center'
        height='100%'
      >
        <Txt
          variant='subtitle1'
          color={grey[600]}
        >
          ...
        </Txt>
      </Col>
    </Box>
  );
}
