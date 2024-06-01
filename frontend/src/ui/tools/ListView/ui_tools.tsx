import React from "react";
import { CircularProgress, CircularProgressProps, Fab, Box, BoxProps } from "@mui/material";
import { RetryIcon, CheckCircleOlIcon } from "@/ui/icons";
import { Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

export function AppendLoading(props: CircularProgressProps): JSX.Element {
  return (
    <Row
      justifyContent='center'
      width='100%'
    >
      <CircularProgress {...props} />
    </Row>
  );
}

type AppendErrorProps = {
  onRetry: () => void;
};
export function AppendError(props: AppendErrorProps): JSX.Element {
  const { onRetry } = props;
  return (
    <Row
      justifyContent='center'
      width='100%'
    >
      <Fab
        onClick={onRetry}
        size='small'
      >
        <RetryIcon />
      </Fab>
    </Row>
  );
}

export function FinishIndicator(props: BoxProps): JSX.Element {
  return (
    <Box {...props}>
      <Row>
        <CheckCircleOlIcon color='success' />
        <Txt color='vague.main'>모두 확인했어요.</Txt>
      </Row>
    </Box>
  );
}
