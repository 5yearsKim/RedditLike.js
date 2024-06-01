"use client";
import React, { useState, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Popover, useTheme } from "@mui/material";
import { green, blue, red, deepOrange } from "@mui/material/colors";
import { Col } from "@/ui/layouts";
import { RangeButton } from "./style";

export type FollowingRangeT = "only" | "except" | undefined;

type FollowingSelectorProps = {
  value: FollowingRangeT;
  size?: "medium" | "small";
  onChange: (newVal: FollowingRangeT) => void;
};

export function FollowingSelector({
  value,
  size,
  onChange,
}: FollowingSelectorProps): JSX.Element {
  const t = useTranslations("components.FollowingSelector");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const theme = useTheme();

  function handleClick(e: MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(e.currentTarget);
  }

  function handlePopoverClose(): void {
    setAnchorEl(null);
  }

  function handleCandidateClick(range: FollowingRangeT): void {
    onChange(range);
    setAnchorEl(null);
  }

  const isDark = theme.palette.mode == "dark";

  const onlySx = {
    color: isDark ? green[900] : green[700],
    bgcolor: isDark ? green[100] : green[50],
    label: t("following"),
    size: size,
  };

  const allSx = {
    color: isDark ? blue[900] : blue[700],
    bgcolor: isDark ? blue[100] : blue[50],
    label: t("all"),
    size: size,
  };

  const exceptSx = {
    color: isDark ? deepOrange[900] : red[700],
    bgcolor: isDark ? deepOrange[50] : red[50],
    label: t("notFollowing"),
    size: size,
  };

  return (
    <>
      <RangeButton
        {...(value == "only" ? onlySx : value == "except" ? exceptSx : allSx)}
        onClick={handleClick}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        disableScrollLock
        slotProps={{
          paper: {
            sx: { my: 1, p: 1 },
          },
        }}
      >
        <Col rowGap={1}>
          <RangeButton
            {...allSx}
            onClick={(): void => handleCandidateClick(undefined)}
          />
          <RangeButton
            {...onlySx}
            onClick={(): void => handleCandidateClick("only")}
          />
          <RangeButton
            {...exceptSx}
            onClick={(): void => handleCandidateClick("except")}
          />
        </Col>
      </Popover>
    </>
  );
}
