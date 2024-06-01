import React, { Fragment } from "react";
import dynamic from "next/dynamic";
import { Popover, IconButton } from "@mui/material";
import { EmojiIcon } from "@/ui/icons";

// import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

// logic
import { useState, MouseEvent } from "react";
import { PopoverOrigin } from "@mui/material";


type EmojiSelectorProps = {
  origin?: PopoverOrigin;
  onEmojiSelect: (emoji: string) => void;
};

export function EmojiSelector({
  origin,
  onEmojiSelect,
}: EmojiSelectorProps): JSX.Element {

  const [emojiPopEl, setEmojiPopEl] = useState<HTMLButtonElement | null>(null);
  const openEmojiPopover = Boolean(emojiPopEl);

  function handleEmojiButtonClick(e: MouseEvent<HTMLButtonElement>): void {
    e.stopPropagation();
    e.preventDefault();
    setEmojiPopEl(e.currentTarget);
  }

  function handleEmojiPopoverClose(): void {
    setEmojiPopEl(null);
  }

  function handleEmojiClick(data: any): void {
    onEmojiSelect(data.emoji);
    setEmojiPopEl(null);
  }

  return (
    <Fragment>
      <IconButton
        aria-label='emoji-button'
        onClick={handleEmojiButtonClick}
      >
        <EmojiIcon />
      </IconButton>
      <Popover
        elevation={5}
        open={openEmojiPopover}
        anchorEl={emojiPopEl}
        onClose={handleEmojiPopoverClose}
        anchorOrigin={origin}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </Popover>
    </Fragment>
  );
}
