"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { TextField, Avatar, Button } from "@mui/material";
import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EditableAvatar } from "@/ui/tools/EditableAvatar";
import { FlairSection } from "./FlairSection";
// logic
import { useState, ChangeEvent, MouseEvent } from "react";
import { useTextForm } from "@/hooks/TextForm";
import { useUniqueCheck } from "@/hooks/UniqueCheck";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { maxLenValidator } from "@/utils/validator";
import * as BoardUserApi from "@/apis/board_users";
import type { BoardT, AuthorT, FlairT, FlairBoxT } from "@/types";
import { buildImgUrl, uploadToS3 } from "@/utils/media";


type AuthorSelectorProps = {
  board: BoardT
  author?: AuthorT|null;
  onApply: (data: { flairs?: FlairT[]; nickname: string | null; avatarPath: string | null }) => any;
  onCancel: () => void;
};

export function AuthorSelector({
  board,
  author,
  onApply,
  onCancel,
}: AuthorSelectorProps): JSX.Element {
  const t = useTranslations("components.AuthorSelector");

  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const [avatarPath, setAvatarPath] = useState<string | null>(author?.avatar_path ?? null);
  const [flairs, setFlairs] = useState<FlairT[]>(author?.flairs ?? []);
  const {
    val: nickname,
    setVal: setNickname,
    errText: nicknameErrText,
    isValid: nicknameIsValid,
  } = useTextForm(author?.nickname ?? "", {
    validators: [maxLenValidator(24)],
  });

  const isManager = author?.is_manager == true;

  const trimmed = nickname.trim();

  const { uniqueStatus } = useUniqueCheck({
    text: nickname.trim(),
    checkUnique: async (text: string) => {
      const rsp = await BoardUserApi.checkNicknameUnique(board.id, text);
      return rsp.data;
    },
    forceCheck: (text: string) => {
      if (!text.length || !nicknameIsValid) {
        return "init";
      }
      if (trimmed == (author?.nickname ?? "").trim()) {
        return "unique";
      }
      return undefined;
    },
  });

  const submitDisable = !nicknameIsValid || ["checking", "duplicate"].includes(uniqueStatus);

  function handleNicknameChange(e: ChangeEvent<HTMLInputElement>): void {
    setNickname(e.target.value);
  }

  async function handleAvatarSelect(imgFile: File): Promise<void> {
    try {
      const { putUrl, key } = await BoardUserApi.getAvatarPresignedUrl(board.id, imgFile.type);
      await uploadToS3(putUrl, imgFile);
      setAvatarPath(key);
    } catch (e) {
      enqueueSnackbar(t("imageUploadFailed"), { variant: "error" });
    }
  }

  function handleAvatarRemove(): void {
    setAvatarPath(null);
  }

  function handleFlairSelect(flair: FlairT, box: FlairBoxT): void {
    const idx = flairs.findIndex((item) => item.id == flair.id);
    if (idx < 0) {
      // too many flags -> end
      if (flairs.length >= 3) {
        showAlertDialog({
          body: t("alertMaxFlair", { n: 3 }),
          useOk: true,
        });
        return;
      }
      // multiple box
      if (box.is_multiple) {
        setFlairs([...flairs, flair]);
      } else {
        // single -> replace previous box item
        const filteredFlairs = flairs.filter((item) => item.box_id !== box.id);
        setFlairs([...filteredFlairs, flair]);
      }
    } else {
      // already exist -> remove from list;
      const newFlairs = [...flairs];
      newFlairs.splice(idx, 1);
      setFlairs(newFlairs);
    }
  }

  function handleApplyClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    onApply({
      flairs,
      nickname: Boolean(trimmed) ? trimmed : null,
      avatarPath,
    });
  }

  function handleCancelClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    onCancel();
  }


  return (
    <Fragment>
      <Txt variant='h6' alignSelf='flex-start'>{t("selectProfile")}</Txt>
      {/* <Divider/> */}
      <Gap y={2} />

      <Col alignItems='center'>
        <EditableAvatar
          src={avatarPath ? buildImgUrl(null, avatarPath, { size: "xs" }) : undefined}
          onImageSelect={handleAvatarSelect}
          onImageRemove={handleAvatarRemove}
          renderAvatar={(src): JSX.Element => {
            let avatarUrl: string|undefined = undefined;
            if (src) {
              avatarUrl = src;
            } else if (board.default_avatar_path) {
              avatarUrl = buildImgUrl(null, board.default_avatar_path, { size: "xs" });
            }

            return (
              <Avatar
                src={avatarUrl}
                sx={{
                  width: "80px",
                  height: "80px",
                  userSelect: "none",
                  pointerEvents: "none",
                  border: "solid 1px #dddddd",
                }}
              />
            );
          }}
        />
        <TextField
          label={t("nickname")}
          variant='standard'
          value={nickname}
          onChange={handleNicknameChange}
          error={Boolean(nicknameErrText)}
          helperText={nicknameErrText}
          placeholder={board.default_nickname ?? t("anonymous")}
          autoComplete='off'
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputProps: {
              style: { textAlign: "center" },
            },
          }}
        />
        {uniqueStatus === "checking" && (
          <Txt
            color='warning.main'
            variant='body3'
          >
            {t("checkingDuplicate")}
          </Txt>
        )}
        {uniqueStatus === "duplicate" && (
          <Txt
            color='error.main'
            variant='body3'
          >
            {t("alreadyExist")}
          </Txt>
        )}
        {uniqueStatus === "unique" && (
          <Txt
            color='success.main'
            variant='body3'
          >
            {t("nicknameValid")}
          </Txt>
        )}
      </Col>
      {board.use_flair && (
        <FlairSection
          isManager={isManager}
          boardId={board.id}
          selected={flairs}
          onFlairSelect={handleFlairSelect}
        />
      )}

      <Gap y={4} />

      <Row justifyContent='flex-end'>
        <Button onClick={handleCancelClick}>
          {t("cancel")}
        </Button>
        <Button
          variant='contained'
          disabled={submitDisable}
          onClick={handleApplyClick}
        >
          {t("apply")}
        </Button>
      </Row>
    </Fragment>
  );
}
