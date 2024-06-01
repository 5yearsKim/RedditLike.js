"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, InputAdornment } from "@mui/material";
import { Gap, Col } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

// logic
import { useMe } from "@/stores/UserStore";
import { useGroup } from "@/stores/GroupStore";
import { useManagingBoardsStore, getManagingBoardsListOpt } from "@/stores/ManagingBoardsStore";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { useTextForm } from "@/hooks/TextForm";
import { noEmptyValidator, maxLenValidator } from "@/utils/validator";
import { BoardFormT } from "@/types/Board";
import * as BoardApi from "@/apis/boards";

export function CreateBoardForm(): JSX.Element {
  const t = useTranslations("pages.CreateBoardPage.CreateBoardForm");
  const router = useRouter();

  const me = useMe();
  const group = useGroup();
  if (!group) {
    throw new Error("group shold be valid");
  }

  const { actions: managingBoardsAct } = useManagingBoardsStore();
  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const {
    val: boardName,
    isValid: isBoardNameValid,
    errText: boardNameErrText,
    setVal: setBoardName,
  } = useTextForm("", {
    validators: [noEmptyValidator(), maxLenValidator(24)],
  });
  const {
    val: description,
    isValid: isDescriptionValid,
    errText: descriptionErrText,
    setVal: setDescription,
  } = useTextForm("", {
    validators: [noEmptyValidator(), maxLenValidator(200)],
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isInputShrink, setIsInputShrink] = useState<boolean>(false);

  const submitDisable = isSubmitting || !isDescriptionValid || !isBoardNameValid;

  useEffect(() => {
    setTimeout(() => {
      setIsInputShrink(true);
    }, 3000);
  }, []);

  function handleBoardNameChange(e: ChangeEvent<HTMLInputElement>): void {
    setBoardName(e.target.value);
  }

  function handleDescriptionChange(e: ChangeEvent<HTMLInputElement>): void {
    setDescription(e.target.value);
  }

  async function handleSubmit(): Promise<void> {
    const form: BoardFormT = {
      group_id: group!.id,
      name: boardName,
      description: description,
    };
    if (!isBoardNameValid) {
      enqueueSnackbar(boardNameErrText ?? "", { variant: "error" });
      return;
    }
    if (!isDescriptionValid) {
      enqueueSnackbar( descriptionErrText ?? "", { variant: "error" });
      return;
    }
    try {
      setIsSubmitting(true);
      await BoardApi.create(form);
      setIsSubmitting(false);

      router.push("/boards?sort=recent&refresh=true");

      enqueueSnackbar(t("createBoardSuccess", { boardName }), { variant: "success" });
      // enqueueSnackbar(`"${boardName}" 게시판을 생성했어요.`, { variant: "success" });

      // init managing board on sidebar
      if (me) {
        const listOpt = getManagingBoardsListOpt({ userId: me?.id });
        managingBoardsAct.load(listOpt, { force: true, skipLoading: true });
      }
    } catch (e: any) {
      const errCode = e.response?.data?.code;
      if (errCode == "ALREADY_EXIST") {
        showAlertDialog({
          title: t("nameAlreadyExist"),
          body: t("nameAlreadyExistMsg", { boardName }),
          useOk: true,
          themeDisabled: true,
        });
      }
      console.warn(e);
      setIsSubmitting(false);
    }
    return;
  }


  return (
    <Col>
      <Txt variant='h5'>{t("createBoard")}</Txt>

      <Gap y={2} />

      <Box
        width='100%'
        display='flex'
        flexDirection='column'
      >
        <TextField
          variant='standard'
          label={t("boardName")}
          placeholder={t("boardNameHelper")}
          value={boardName}
          error={Boolean(boardNameErrText)}
          helperText={boardNameErrText}
          onChange={handleBoardNameChange}
          autoComplete='off'
          InputProps={{
            startAdornment: boardName ? <InputAdornment position='start'>{t("board")}/</InputAdornment> : undefined,
          }}
          InputLabelProps={isInputShrink ? { shrink: true } : undefined}
        />
        <TextField
          variant='filled'
          label={t("boardDescription")}
          value={description}
          onChange={handleDescriptionChange}
          placeholder={t("boardDescriptionHelper")}
          error={Boolean(descriptionErrText)}
          helperText={descriptionErrText}
          fullWidth
          multiline={true}
          minRows={3}
          maxRows={8}
          autoComplete='off'
          InputLabelProps={isInputShrink ? { shrink: isInputShrink } : undefined}
        />
      </Box>

      <Gap y={4} />

      <Button
        fullWidth
        variant='contained'
        onClick={handleSubmit}
        disabled={submitDisable}
        sx={{
          whiteSpace: "nowrap",
        }}
      >
        {t("createBoard")}
      </Button>
    </Col>
  );
}
