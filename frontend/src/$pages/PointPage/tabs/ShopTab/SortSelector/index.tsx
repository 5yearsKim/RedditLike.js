"use client";
import React, { useState, MouseEvent } from "react";
import { Popover, Button } from "@mui/material";
import { Col, Row, Box } from "@/ui/layouts";
import { SortIcon } from "@/ui/icons";
import type { ListGifticonProductOptionT } from "@/types";

type GifticonProductSortT = ListGifticonProductOptionT["sort"];

type SortSelectorProps = {
  sort: GifticonProductSortT| undefined;
  onChange: (sort: GifticonProductSortT | undefined) => void;
};

export function SortSelector(props: SortSelectorProps): JSX.Element {
  const { sort, onChange } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handlePopoverClose(): void {
    setAnchorEl(null);
  }

  function handleClick(e: MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(e.currentTarget);
  }

  function getSortSummary(): string {
    if (sort == "cheap") {
      return "가격 낮은순";
    }
    if (sort == "expensive") {
      return "가격 높은순";
    }
    return "기본순";
  }

  function handleSortSelect(sort: GifticonProductSortT | undefined): void {
    onChange(sort);
    setAnchorEl(null);
  }

  return (
    <>
      <Button
        onClick={handleClick}
        variant='outlined'
        sx={{
          borderRadius: 8,
          whiteSpace: "nowrap",
        }}
      >
        <Row>
          <SortIcon fontSize='small' />
          <Box mr={0.5} />
          {getSortSummary()}
        </Row>
      </Button>
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
          <Button onClick={(): void => handleSortSelect(undefined)}>기본순</Button>
          <Button onClick={(): void => handleSortSelect("cheap")}>↓ 가격 낮은 순</Button>
          <Button onClick={(): void => handleSortSelect("expensive")}>↑ 가격 높은 순</Button>
        </Col>
      </Popover>
    </>
  );
}
