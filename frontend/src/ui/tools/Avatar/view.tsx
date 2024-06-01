import React, { useMemo } from "react";
import { Avatar as MuiAvatar } from "@mui/material";
import { PersonIcon } from "@/ui/icons";
import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
} from "@mui/material/colors";
import { sumAscii } from "./utils";
import { AvatarProps as MuiAvatarProps } from "@mui/material";

const avatarPalette = [
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
];


export interface AvatarProps extends MuiAvatarProps {
  size?: number | string;
  rseed?: number | string;
  letter?: string;
}


export function Avatar({
  size,
  rseed,
  letter,
  ...muiAvatarProps
}: AvatarProps): JSX.Element {
  // size
  const sz = typeof size === "number" ? `${size}px` : size;
  const avatarSz = `calc(${sz} * 0.8)`;
  const fontSz = `calc(${sz} * 0.75)`;

  // colors
  const colorInfo = useMemo(() => {
    let color: any = grey;
    let isSwap = false;
    if (muiAvatarProps.src) {
      return { bgColor: undefined, txtColor: undefined };
    }
    if (rseed) {
      const seed = typeof rseed === "number" ? rseed : sumAscii(rseed);
      const idx = seed % avatarPalette.length;
      color = avatarPalette[idx];
      isSwap = Boolean(Math.ceil(seed / avatarPalette.length) % 2);
    }
    let bgColor = color[500];
    let txtColor = color[50];
    if (letter) {
      txtColor = "#ffffff";
    } else if (isSwap) {
      const tmp = bgColor;
      bgColor = txtColor;
      txtColor = tmp;
    }
    return { bgColor, txtColor };
  }, []);

  return (
    <MuiAvatar
      {...muiAvatarProps}
      sx={{
        ...muiAvatarProps.sx,
        width: sz,
        height: sz,
        fontSize: fontSz,
        bgcolor: colorInfo.bgColor,
        // bgcolor: 'transparent',
        color: colorInfo.txtColor,
      }}
    >
      {letter ? letter : <PersonIcon sx={{ width: avatarSz, height: avatarSz }} />}
    </MuiAvatar>
  );
}
