"use client";

import React, { useState, MouseEvent, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Popover, InputBase, IconButton } from "@mui/material";
import { Row, Gap } from "@/ui/layouts";
import { LinkIcon, LinkOffIcon, CheckIcon } from "@/ui/icons";
import { useSnackbar } from "@/hooks/Snackbar";
import { checkUrl } from "@/utils/misc";
import { ButtonProps } from "./type";
import { IB } from "./style";

export function LinkIB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  const t = useTranslations("components.RichEditor2.buttons.LinkIB");
  const { enqueueSnackbar } = useSnackbar();

  const [editorEl, setEditorEl] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState<string>("");

  function handleLinkSubmit(): void {
    if (!checkUrl(url)) {
      window.alert(t("invalidUrl"));
      return;
    }

    // empty
    // on enter pressed
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
    setUrl("");
    setEditorEl(null);
  }

  function handleUrlChange(e: ChangeEvent<HTMLInputElement>): void {
    setUrl(e.target.value);
  }

  function handleLink(e: MouseEvent<HTMLElement>): void {
    const { from, to } = editor.view.state.selection;
    if (from == to) {
      enqueueSnackbar(t("selectText"), { variant: "info" });
      return;
    }
    const previousUrl = editor.getAttributes("link").href;
    if (previousUrl) {
      setUrl(previousUrl);
    }
    setEditorEl(e.currentTarget);
  }

  function handleUnlink(): void {
    editor.chain().focus().unsetLink().run();
  }

  function handleEditorClose(): void {
    setUrl("");
    setEditorEl(null);
  }

  const isActive = editor.isActive("link");

  return (
    <>
      <Popover
        open={Boolean(editorEl)}
        anchorEl={editorEl}
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
                handleLinkSubmit();
              }
            }}
          />
          <IconButton
            color='success'
            disabled={url.length == 0}
            onClick={handleLinkSubmit}
          >
            <CheckIcon />
          </IconButton>
        </Row>
      </Popover>
      <IB
        icon={isActive ? <LinkOffIcon /> : <LinkIcon />}
        onClick={isActive ? handleUnlink : handleLink}
      />
    </>
  );
}
