"use client";

import React, { useState, MouseEvent, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Popover, InputBase, IconButton } from "@mui/material";
import { Row, Gap } from "@/ui/layouts";
import { YoutubeIcon, CheckIcon } from "@/ui/icons";
import { useSnackbar } from "@/hooks/Snackbar";
import { isValidYoutubeUrl } from "../extensions/Youtube";
import { ButtonProps } from "./type";
import { IB } from "./style";

export function YoutubeIB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  const t = useTranslations("components.RichEditor2.buttons.YoutubeIB");

  const [editorEl, setEditorEl] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  function _reset(): void {
    setUrl("");
    setEditorEl(null);
  }

  function handleYoutubeSubmit(): void {
    if (!url) {
      return;
    }
    if (!isValidYoutubeUrl(url)) {
      enqueueSnackbar(t("invalidYoutube"), { variant: "error" });
      return _reset();
    }
    // if (url.includes('/shorts/') && !url.includes('?feature=share')) {
    //   showSnackbar('error', '유튜브 쇼츠는 "공유" 버튼을 클릭해서 url 을 복사해주세요.');
    //   setEditorEl(null);
    //   return _reset();
    // }
    // console.log('url', url);
    editor.commands.setYoutubeVideo({
      src: url,
      // width: Math.max(320, parseInt(widthRef.current.value, 10)) || 640,
      // height: Math.max(180, parseInt(heightRef.current.value, 10)) || 480,
    });

    const cursor = editor.view.state.selection.to;
    editor
      .chain()
      .focus()
      .setTextSelection(cursor + 1)
      .run();
    editor.commands.insertContent("<p></p>");
    return _reset();
  }

  function handleUrlChange(e: ChangeEvent<HTMLInputElement>): void {
    setUrl(e.target.value);
  }

  function handleIconClick(e: MouseEvent<HTMLElement>): void {
    setEditorEl(e.currentTarget);
  }

  function handleEditorClose(): void {
    setUrl("");
    setEditorEl(null);
  }

  return (
    <>
      <Popover
        open={Boolean(editorEl)}
        anchorEl={editorEl}
        disableRestoreFocus
        onClose={handleEditorClose}
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
          <span>URL:</span>
          <Gap x={1} />
          <InputBase
            placeholder={t("typeLinkMsg")}
            onChange={handleUrlChange}
            value={url}
            type='url'
            onKeyDown={(e): void => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleYoutubeSubmit();
              }
            }}
          />
          <IconButton
            color='success'
            disabled={url.length == 0}
            onClick={handleYoutubeSubmit}
          >
            <CheckIcon />
          </IconButton>
        </Row>
      </Popover>
      <IB
        icon={<YoutubeIcon />}
        onClick={handleIconClick}
      />
    </>
  );
}
