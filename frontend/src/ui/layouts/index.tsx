import { ReactNode } from "react";
// import { alpha, styled } from '@mui/material/styles';
import {
  Stack,
  type StackProps,
  Box,
  type BoxProps,
  Grid,
  type GridProps,
  Container as MuiContainer,
  type ContainerProps as MuiContainerProps,
} from "@mui/material";


export { Box, type BoxProps };


type GapProps = {
  x?: string | number;
  y?: string | number;
};

export function Gap({ x, y }: GapProps): ReactNode {
  return (
    <Box
      mr={x}
      mt={y}
    />
  );
}

type RowProps = StackProps

export const Row = (props: RowProps): ReactNode => {
  return (
    <Stack
      display='flex'
      direction='row'
      flexDirection='row'
      alignItems='center'
      {...props}
    />
  );
};

type ColProps = StackProps

export const Col = (props: ColProps): ReactNode => {
  return (
    <Stack
      display='flex'
      direction='column'
      flexDirection='column'
      {...props}
    />
  );
};

export const Expand = (props: BoxProps): ReactNode => {
  return (
    <Box
      flex={1}
      {...props}
    />
  );
};

export const Center = (props: BoxProps): ReactNode => {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      {...props}
    />
  );
};

interface ContainerProps extends MuiContainerProps {
  rtlP?: boolean;
}

export const Container = ({ rtlP, ...muiProps }: ContainerProps): ReactNode => {
  return (
    <MuiContainer
      maxWidth='md'
      sx={{
        ...(rtlP && { padding: { xs: "16px", sm: "16px" } }),
        ...(rtlP && { paddingBottom: "0px" }),
        ...muiProps.sx,
      }}
      {...muiProps}
    />
  );
};

export function GridItem(props: GridProps): ReactNode {
  return (
    <Grid
      item
      display='flex'
      alignItems='center'
      justifyContent='center'
      {...props}
    />
  );
}
