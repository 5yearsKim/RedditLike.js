import React from "react";
import {
  CircularProgress, type CircularProgressProps,
  Box, Typography,
} from "@mui/material";


interface CircularProgressWithLabelProps extends CircularProgressProps {
  value: number;
}

export function CircularProgressWithLabel({
  value,
  ...props
}: CircularProgressWithLabelProps): JSX.Element {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant='determinate'
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant='caption'
          component='div'
          color='text.secondary'
        >{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}