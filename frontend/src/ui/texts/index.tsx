import { ReactNode } from "react";
import { Typography, TypographyProps } from "@mui/material";

export const Txt = (props: TypographyProps): ReactNode => (
  <Typography
    variant='body1'
    {...props}
  />
);

type EllipsisTxtProps = TypographyProps & { maxLines: number };

export const EllipsisTxt = (props: EllipsisTxtProps): ReactNode => {
  const { maxLines, ...txtProps } = props;
  return (
    <Txt
      variant='body2'
      textOverflow='ellipsis'
      sx={{
        wordBreak: "break-word",
        overflow: "hidden",
        display: "-webkit-box",
        whiteSpace: "normal",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical",
        ...txtProps.sx,
      }}
      {...txtProps}
    />
  );
};


export function ClickableTxt(props: TypographyProps): ReactNode {
  return (
    <Typography
      sx={{
        cursor: "pointer",
        "&:hover": {
          textDecoration: "underline",
        },
      }}
      {...props}
    />
  );
}
