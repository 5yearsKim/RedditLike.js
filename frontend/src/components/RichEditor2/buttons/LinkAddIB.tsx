import React, { useState, MouseEvent, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Popover, Box, InputBase, IconButton, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import { Row, Gap } from "@/ui/layouts";
import { AddLinkIcon, CheckIcon } from "@/ui/icons";
import { checkUrl } from "@/utils/misc";
import { ButtonProps } from "./type";
import { IB } from "./style";


export function LinkAddIB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  const t = useTranslations("components.RichEditor2.buttons.LinkAddIB");

  const [editorEl, setEditorEl] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState<string>("");
  const [linkType, setLinkType] = useState<"text" | "preview">("text");

  function handleLinkSubmit(): void {
    // empty
    // on enter pressed

    if (!checkUrl(url)) {
      if (!url.startsWith("http")) {
        window.alert(t("checkHttp"));
      } else {
        window.alert(t("invalidUrl"));
      }
      return;
    }

    if (linkType == "text") {
      editor.commands.insertContent(`<a href="${url}">${url}</a>`);
    }
    if (linkType == "preview") {
      editor.commands.insertContent(`<link-preview url="${url}"></link-preview><p></p>`);
    }

    // clear
    setUrl("");
    setEditorEl(null);
  }

  function handleUrlChange(e: ChangeEvent<HTMLInputElement>): void {
    setUrl(e.target.value);
  }

  function handleLink(e: MouseEvent<HTMLElement>): void {
    setEditorEl(e.currentTarget);
  }

  function handleLinkTypeChange(e: ChangeEvent<HTMLInputElement>): void {
    setLinkType(e.target.value as any);
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
        <Box px={1}>
          <Row justifyContent='flex-end'>
            <RadioGroup
              defaultValue='text'
              value={linkType}
              onChange={handleLinkTypeChange}
              row
            >
              <FormControlLabel
                value='text'
                control={<Radio size='small' />}
                label={t("text")}
              />
              <FormControlLabel
                value='preview'
                control={<Radio size='small' />}
                label={t("preview")}
              />
            </RadioGroup>
          </Row>

          <Row>
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
        </Box>
      </Popover>
      <IB
        icon={<AddLinkIcon />}
        onClick={handleLink}
      />
    </>
  );
}
