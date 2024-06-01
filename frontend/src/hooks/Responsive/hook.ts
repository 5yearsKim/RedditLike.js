"use client";

import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// type DeviceT = 'mobile'|'tablet'|'desktop'

export function useResponsive() {
  const theme = useTheme();

  const downSm = useMediaQuery(theme.breakpoints.down("sm"));
  const downMd = useMediaQuery(theme.breakpoints.down("md"));
  const downLg = useMediaQuery(theme.breakpoints.down("lg"));

  const upSm = !downSm;
  const upMd = !downMd;
  const upLg = !downLg;

  return {
    downSm,
    downMd,
    downLg,

    upSm,
    upMd,
    upLg,
  };
}

import { useEffect, useState } from "react";

export function useUserAgent() {
  const [isMobile, setIsMobile] = useState<undefined | boolean>(undefined);

  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    console.log("userAgent", userAgent);
    const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
    setIsMobile(mobile);
    // setIsMobile(true)
  }, []);

  return {
    isMobile,
  };
}
