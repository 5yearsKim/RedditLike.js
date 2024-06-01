"use client";
import React, { forwardRef } from "react";
import { useTranslations } from "next-intl";
import { EditorContent } from "@tiptap/react";
import { Box, Popover, Paper } from "@mui/material";
import { Col, Row, Gap } from "@/ui/layouts";
import { ArrowDropDownIcon } from "@/ui/icons";

import { ControlledBubbleMenu } from "./items/ControlledBubbleMenu";
import { ImageAddDialog } from "./items/ImageAddDialog";
import { PollAddDialog } from "./items/PollAddDialog";
import {
  AlignIB, BoldIB, UnderlineIB, ItalicIB, StrikeIB,
  BlockQuoteIB, YoutubeIB, LinkIB, ImageIB, LinkAddIB,
  TweetIB, TextTB, HeadingTB, BulletListTB, OrderedListTB,
  CodeBlockTB, PollIB,
} from "./buttons";
import { useLogic } from "./logic";
import { RichEditor2Props, RichEditor2T } from "./type";


export const RichEditor2 = forwardRef<RichEditor2T, RichEditor2Props>((props: RichEditor2Props, ref): JSX.Element => {
  const {
    imageDialogRef,
    editor,
    bubbleOpen,
    textSelectionEl,
    disableFeatures,
    imageDialogOpen,
    pollDialogOpen,
    handleTextSelectionClick,
    handleTextSelectionClose,
    handleImageDialogUploaded,
    handleImageDialogOpen,
    handleImageDialogClose,
    handlePollDialogOpen,
    handleCheckBubble,
    onFocus,
    handleBlur,
    handlePollDialogClose,
    handlePollCreated,
  } = useLogic(props, ref);

  const t = useTranslations("components.RichEditor2");

  if (!editor) {
    return <></>;
  }

  function getTextPopupLabel(): string {
    if (!editor) {
      return "";
    }
    if (editor.isActive("heading", { level: 1 })) {
      return t("heading") + "1";
    } else if (editor.isActive("heading", { level: 2 })) {
      return t("heading") + "2";
    } else if (editor.isActive("heading", { level: 3 })) {
      return t("heading") + "3";
    } else if (editor.isActive("bulletList")) {
      return t("list");
    } else if (editor.isActive("orderedList")) {
      return t("numList");
    } else if (editor.isActive("codeBlock")) {
      return t("code");
    }
    return t("text");
  }

  const dFeatures = disableFeatures ?? [];

  const { view, state } = editor;
  const { from: _from, to: _to } = view.state.selection;
  const isTextSelected = state.doc.textBetween(_from, _to, "").trim().length > 0;

  return (
    <>
      {editor && (
        <div>
          <ControlledBubbleMenu
            editor={editor}
            open={bubbleOpen}
          >
            <Paper
              sx={{
                borderRadius: 8,
                boxShadow: 0,
                bgcolor: "#404444",
                maxWidth: "100vw",
                overflowX: "scroll",
                "::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Row
                mx={2}
                tabIndex={0}
              >
                <Box
                  display='flex'
                  pl={1}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.3)",
                    },
                    color: "#fff",
                  }}
                  onClick={handleTextSelectionClick}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      whiteSpace: "pre",
                    }}
                  >
                    {getTextPopupLabel()}
                  </span>
                  <ArrowDropDownIcon />
                </Box>
                <Box mr={0.5} />
                <Popover
                  open={Boolean(textSelectionEl)}
                  anchorEl={textSelectionEl}
                  onClose={handleTextSelectionClose}
                  sx={{ my: 1 }}
                  slotProps={{
                    paper: { sx: { bgcolor: "#444444", boxShadow: 0 } },
                  }}
                  disableRestoreFocus
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <Col>
                    <TextTB editor={editor} />
                    {!dFeatures.includes("heading") && (
                      <>
                        <HeadingTB
                          level={1}
                          editor={editor}
                        />
                        <HeadingTB
                          level={2}
                          editor={editor}
                        />
                        <HeadingTB
                          level={3}
                          editor={editor}
                        />
                      </>
                    )}
                    <BulletListTB editor={editor} />
                    <OrderedListTB editor={editor} />
                    <CodeBlockTB editor={editor} />
                  </Col>
                </Popover>

                <BoldIB editor={editor} />
                <ItalicIB editor={editor} />
                <UnderlineIB editor={editor} />
                <StrikeIB editor={editor} />
                {!dFeatures.includes("align") && <AlignIB editor={editor} />}

                <Gap x={1} />
                <BlockQuoteIB editor={editor} />
                {!dFeatures.includes("link") && (
                  <>{isTextSelected ? <LinkIB editor={editor} /> : <LinkAddIB editor={editor} />}</>
                )}
                <ImageIB
                  editor={editor}
                  onClick={handleImageDialogOpen}
                />
                {!dFeatures.includes("youtube") && <YoutubeIB editor={editor} />}
                {!dFeatures.includes("tweet") && (
                  <TweetIB
                    editor={editor}
                    handleTextSelectionClose={handleTextSelectionClose}
                  />
                )}
                {!dFeatures.includes("poll") && (
                  <PollIB
                    editor={editor}
                    onClick={handlePollDialogOpen}
                  />
                )}
              </Row>
            </Paper>
          </ControlledBubbleMenu>
        </div>
      )}
      <EditorContent
        editor={editor}
        onClickCapture={handleCheckBubble}
        onFocus={onFocus}
        onBlur={handleBlur}
      />
      <ImageAddDialog
        ref={imageDialogRef}
        open={imageDialogOpen}
        onUploaded={handleImageDialogUploaded}
        onClose={handleImageDialogClose}
      />
      <PollAddDialog
        open={pollDialogOpen}
        onClose={handlePollDialogClose}
        onCreated={handlePollCreated}
      />
    </>
  );
});
