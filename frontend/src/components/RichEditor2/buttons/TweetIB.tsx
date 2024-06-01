"use client";
import React, { useState, MouseEvent, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Popover, InputBase, IconButton } from "@mui/material";
import { Row } from "@/ui/layouts";
import { useSnackbar } from "@/hooks/Snackbar";
import { TwitterIcon, CheckIcon } from "@/ui/icons";
import { IB } from "./style";
import type { ButtonProps } from "./type";

interface TweetIBProps extends ButtonProps {
  handleTextSelectionClose: () => void;
}

export function TweetIB(props: TweetIBProps): JSX.Element {
  const { editor, handleTextSelectionClose } = props;
  const t = useTranslations("components.RichEditor2.buttons.TweetIB");

  const [editorEl, setEditorEl] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  function _reset(): void {
    setUrl("");
    setEditorEl(null);
    handleTextSelectionClose();
  }

  function handleButtonClick(e: MouseEvent<HTMLElement>): void {
    setEditorEl(e.currentTarget);
  }

  function handleEditorClose(): void {
    setUrl("");
    setEditorEl(null);
  }

  function handleUrlChange(e: ChangeEvent<HTMLInputElement>): void {
    setUrl(e.target.value);
  }

  function handleTweetSubmit(): void {
    if (!url) {
      return;
    }

    // check if uri is tweet id
    const idRegex = /^[0-9]+$/;
    const isId = idRegex.test(url);
    if (isId) {
      editor.commands.insertContent(`<tweet id="tweet_${url}"></tweet><p></p>`);
      return _reset();
    }

    // check if valid tweet url
    const tweetIdRegex = /\/status\/(\d+)/;

    // Use the regex to extract the tweet ID
    const match = url.match(tweetIdRegex);

    if (match && match[1]) {
      const tweetId = match[1];
      editor.commands.insertContent(`<tweet id="tweet_${tweetId}"></tweet><p></p>`);
      return _reset();
    } else {
      enqueueSnackbar(t("invalidTweet"), { variant: "error" });
      return _reset();
    }
  }

  return (
    <>
      <Popover
        open={Boolean(editorEl)}
        anchorEl={editorEl}
        onClose={handleEditorClose}
        disableRestoreFocus
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
      >
        <Row mx={1}>
          <InputBase
            placeholder={t("tweetIdOrLink")}
            onChange={handleUrlChange}
            value={url}
            type='url'
            sx={{ minWidth: 200 }}
            onKeyDown={(e): void => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleTweetSubmit();
              }
            }}
          />
          <IconButton
            color='success'
            disabled={url.length == 0}
            onClick={handleTweetSubmit}
          >
            <CheckIcon />
          </IconButton>
        </Row>
      </Popover>
      <IB
        icon={<TwitterIcon />}
        onClick={handleButtonClick}
      />
    </>
  );
}
