import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Box, Button } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ErrorIcon, RetryIcon, HomeIcon } from "@/ui/icons";
import { Col, Gap, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

type ErrorBoxProps = {
  height?: string;
  message?: string;
  showHome?: boolean;
  onRetry?: () => void;
};

export function ErrorBox({
  height,
  message,
  showHome,
  onRetry,
}: ErrorBoxProps): JSX.Element {
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
        <ErrorIcon sx={{ width: "60px", height: "60px", color: grey[600] }} />
        <Gap y={2} />
        <Txt color={grey[600]}>{message ?? t("loadFailed")}</Txt>
        <Gap y={2} />
        <Row>
          {showHome && (
            <Link href='/'>
              <Button
                variant='outlined'
                startIcon={<HomeIcon />}
              >
                {t("toHome")}
              </Button>
            </Link>
          )}
          <Gap x={1} />
          {onRetry && (
            <Button
              variant='outlined'
              startIcon={<RetryIcon />}
              onClick={onRetry}
            >
              {t("retry")}
            </Button>
          )}
        </Row>
      </Col>
    </Box>
  );
}
