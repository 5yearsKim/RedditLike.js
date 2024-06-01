import React, { Fragment, useState, MouseEvent } from "react";

import { Box, Collapse, IconButton } from "@mui/material";
import { Row, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { FoldIcon, UnfoldIcon, RetryIcon } from "@/ui/icons";

type BoardSectionProps = {
  storageKey?: string;
  title: string;
  children: JSX.Element;
  onRegenClick?: () => any;
};

export function BoardSection(props: BoardSectionProps): JSX.Element {
  const { storageKey, title, children, onRegenClick } = props;

  const initOpen = (): boolean => {
    if (storageKey) {
      const prevOpen = localStorage.getItem(storageKey);
      if (prevOpen === "open") {
        return true;
      } else if (prevOpen === "close") {
        return false;
      }
      return true;
    } else {
      return true;
    }
  };

  const [open, setOpen] = useState<boolean>(initOpen());

  function handleTitleClick(): void {
    const newOpen = !open;
    setOpen(newOpen);
    if (storageKey) {
      if (newOpen) {
        localStorage.setItem(storageKey, "open");
      } else {
        localStorage.setItem(storageKey, "close");
      }
    }
  }

  function handleRegenClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    if (onRegenClick) {
      onRegenClick();
    }
  }

  return (
    <Fragment>
      <Box
        px={2}
        pt={2}
        onClick={handleTitleClick}
        sx={{
          cursor: "pointer",
        }}
      >
        <Row>
          <Box pr={1} />
          <Txt color='primary'>{title}</Txt>
          <Expand />
          {open && Boolean(onRegenClick) && (
            <IconButton onClick={handleRegenClick}>
              <RetryIcon sx={{ fontSize: 16, color: "vague.light" }} />
            </IconButton>
          )}
          {open ? <FoldIcon color='primary' /> : <UnfoldIcon color='primary' />}
        </Row>
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </Fragment>
  );
}
