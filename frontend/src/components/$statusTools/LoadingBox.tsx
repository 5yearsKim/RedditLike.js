import React from "react";
import { useTranslations } from "next-intl";
import { Box, CircularProgress } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

type LoadingBoxProps = {
  height?: string;
  message?: string;
};

export function LoadingBox({
  height,
  message,
}: LoadingBoxProps): JSX.Element {
  const t = useTranslations("components.$statusTools");

  return (
    <Box
      width='100%'
      height={height ?? "100%"}
    >
      <Col
        alignItems='center'
        justifyContent='center'
        width='100%'
        height='100%'
      >
        <CircularProgress />
        <Gap y={2} />
        <Txt
          variant='subtitle1'
          color={grey[600]}
          textAlign='center'
        >
          {message ?? t("loading")}
        </Txt>
      </Col>
    </Box>
  );
}
