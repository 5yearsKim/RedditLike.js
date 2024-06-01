"use client";
import React, { forwardRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { TextField, Button, Tabs, Tab, Checkbox, Collapse } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";

import {
  NsfwIcon, SpoilerIcon, CircleIcon, EditIcon,
  VideoAddIcon, PhotoAddIcon, SettingIcon, PollOlIcon,
} from "@/ui/icons";
import { Gap, Row, Col, Box, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardAvatar } from "@/ui/tools/Avatar";
import { Clickable } from "@/ui/tools/Clickable";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";
import { RichEditor2 } from "@/components/RichEditor2";
import { ReserveTimePicker } from "./items/ReserveTimePicker";
import { PhotoEditor } from "./items/PhotoEditor";
import { VideoEditor } from "./items/VideoEditor";
import { FlagSelector } from "./items/FlagSelector";
import { PostDraftBox } from "./items/PostDraftBox";
import { ThumbnailSelector } from "./items/ThumbnailSelector";
import { useLogic } from "./logic";
import { PostEditorProps, PostEditorT } from "./type";
import { useTabCands, TabT } from "./data";

export const PostEditor = forwardRef<PostEditorT, PostEditorProps>((props: PostEditorProps, ref): JSX.Element => {
  const {
    author,
    me,
    board,
    isManager,
    submitDisabled,
    loadDraft,
    saveDraft,
    tab,
    title,
    body,
    images,
    videos,
    isSpoiler,
    isNsfw,
    flags,
    hasContent,
    showCancel,
    showTabs,
    richEditorRef,
    showManager,
    thumbPath,
    advancedOpen,
    reservedAt,
    handleSubmit,
    handleCancel,
    handleDraftSave,
    handleDraftApply,
    handleTitleChange,
    handleBodyChange,
    handleImagesChange,
    handleVideosChange,
    handleTabChange,
    handleFlagsChange,
    handleNsfwClick,
    handleSpolilerClick,
    handleShowTabs,
    handleShowImageDialog,
    handleShowPollDialog,
    handleShowManagerChange,
    handleEmptyBottomClick,
    handleThumbPathChange,
    handleAdvancedSettingClick,
    handleReservedAtChange,
  } = useLogic(props, ref);

  const t = useTranslations("components.PostEditor");

  const { downSm } = useResponsive();
  const tabCands = useTabCands();


  function renderTopLine(): JSX.Element {
    const BoardName = (
      <Link href={`/boards/${board.id}`}>
        <Clickable borderRadius={1}>
          <Row>
            <BoardAvatar
              board={board}
              size='24px'
            />
            <Gap x={1} />
            <Txt variant='h6'>{board.name}</Txt>
          </Row>
        </Clickable>
      </Link>
    );
    const DraftBox = (
      <Row>
        {loadDraft && (
          <PostDraftBox
            boardId={board.id}
            me={me}
            onApply={handleDraftApply}
          />
        )}
        {saveDraft && (
          <Button
            variant='outlined'
            startIcon={<EditIcon />}
            size={downSm ? "small" : "medium"}
            onClick={handleDraftSave}
          >
            {t("saveDraft")}
          </Button>
        )}
      </Row>
    );
    if (downSm) {
      return (
        <Col alignItems='flex-start'>
          <Row width='100%' justifyContent='flex-end'>
            {DraftBox}
          </Row>
          {BoardName}
        </Col>
      );
    } else {
      return (
        <Row>
          {BoardName}
          <Gap x={1} />
          <Expand />
          {DraftBox}
        </Row>
      );
    }
  }

  function renderOptions(): JSX.Element {
    return (
      <Row
        columnGap={1}
        pt={2}
        pb={1}
        onClick={handleEmptyBottomClick}
        sx={{
          overflowX: "scroll",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {board.use_flag && (
          <FlagSelector
            flags={flags}
            onChange={handleFlagsChange}
            board={board}
            isManager={isManager}
          />
        )}

        {board.use_nsfw && (
          <Button
            onClick={handleNsfwClick}
            size={downSm ? "small" : "medium"}
            variant={isNsfw ? "contained" : "outlined"}
            color={isNsfw ? "error" : "vague"}
            startIcon={<NsfwIcon />}
            sx={{
              borderRadius: 4,
              whiteSpace: "pre",
            }}
          >
            {t("nsfw")}
          </Button>
        )}
        {board.use_spoiler && (
          <Button
            onClick={handleSpolilerClick}
            size={downSm ? "small" : "medium"}
            variant={isSpoiler ? "contained" : "outlined"}
            color={isSpoiler ? "warning" : "vague"}
            startIcon={<SpoilerIcon />}
            sx={{
              borderRadius: 4,
              whiteSpace: "pre",
            }}
          >
            {t("spoiler")}
          </Button>
        )}

        <Gap x={1} />

        <Expand />

        {!showTabs && (
          <Row
            sx={{
              button: { flex: "none" },
            }}
          >
            <Button
              onClick={handleShowTabs}
              startIcon={<VideoAddIcon />}
              size={downSm ? "small" : "medium"}
            >
              {t("video")}
            </Button>
            <Button
              startIcon={<PhotoAddIcon />}
              onClick={handleShowImageDialog}
              size={downSm ? "small" : "medium"}
            >
              {t("image")}
            </Button>
            <Button
              startIcon={<PollOlIcon/>}
              size={downSm ? "small" : "medium"}
              onClick={handleShowPollDialog}
            >
              {t("poll")}
            </Button>
          </Row>
        )}
      </Row>
    );
  }


  return (
    <Box>
      <Gap y={2} />
      {renderTopLine()}

      <Collapse in={showTabs}>
        <Tabs
          variant='fullWidth'
          value={tab}
          onChange={handleTabChange}
        >
          {Object.values(tabCands).map((tab) => {
            const showDot = hasContent[tab.value as TabT];
            // const showDot = true;
            return (
              <Tab
                key={tab.value}
                iconPosition='start'
                icon={<tab.icon />}
                value={tab.value}
                label={
                  <>
                    <CircleIcon
                      color='primary'
                      sx={{
                        fontSize: 8,
                        mr: 0.5,
                        display: showDot ? undefined : "none",
                      }}
                    />
                    {tab.label}
                  </>
                }
                wrapped={downSm ? true : false}
              />
            );
          })}
        </Tabs>
      </Collapse>

      <Gap y={1} />

      <TextField
        variant='standard'
        fullWidth
        value={title}
        onChange={handleTitleChange}
        label={t("title")}
        autoSave='off'
        autoComplete='off'
        InputProps={{
          style: { fontWeight: 700, fontSize: "1.1rem" },
        }}
        inputProps={{
          maxLength: 255,
        }}
      />

      <Gap y={2} />

      {tab === "post" && (
        <RichEditor2
          ref={richEditorRef}
          value={body}
          className='post-editor-specific'
          placeholder={t("placeholder")}
          onChange={handleBodyChange}
        />
      )}
      {tab === "photo" && (
        <PhotoEditor
          images={images}
          onImagesUpdated={handleImagesChange}
        />
      )}
      {tab === "video" && (
        <VideoEditor
          videos={videos}
          onVideosUpdated={handleVideosChange}
        />
      )}

      {renderOptions()}

      <Row>
        <Box onClick={(e): void => e.stopPropagation()}>
          <Button
            size='small'
            onClick={handleAdvancedSettingClick}
            // disabled={advancedOpen}
            sx={{
              color: advancedOpen ? "vague.light" : undefined,
            }}
          >
            <Row
              sx={{ whiteSpace: "pre" }}
              columnGap={0.5}
            >
              <SettingIcon fontSize='small' />
              {downSm ? t("advanced") : t("advancedSetting")}
            </Row>
          </Button>
        </Box>


        <Expand />
        {showCancel && (
          <Button onClick={handleCancel}>
            {t("cancel")}
          </Button>
        )}

        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={submitDisabled}
        >
          {t("submit")}
        </Button>
      </Row>

      {/* 고급 설정 */}
      <Collapse in={advancedOpen}>
        <Box mb={2}>
          <ThumbnailSelector
            editorRef={richEditorRef}
            thumbnail={thumbPath}
            onChange={handleThumbPathChange}
          />

          <Gap y={4} />

          <Row justifyContent='center'>
            <ReserveTimePicker
              reservedAt={reservedAt}
              onChange={handleReservedAtChange}
            />
            {/* <ReserveButton
                onSubmit={handleReservedSave}
              /> */}
          </Row>
        </Box>
      </Collapse>

      <Row justifyContent='flex-end'>
        {author?.is_manager && (
          <Row
            justifyContent='center'
            mb={2}
          >
            <Gap x={1} />
            <Txt variant='body3'>{t("boardManager")}</Txt>
            <Box mr={0.5} />
            <HelperTooltip
              fontSize={18}
              tip={t("boardManagerHelper")}
            />
            <Checkbox
              checked={showManager}
              onChange={handleShowManagerChange}
              size='small'
            />
          </Row>
        )}
      </Row>

      <Gap y={10} />
    </Box>
  );
});
