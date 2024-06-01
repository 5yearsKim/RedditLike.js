"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { useResponsive } from "@/hooks/Responsive";
import { AuthorFingerprint } from "@/components/AuthorFingerprint";
import { Box, Button, IconButton, Dialog, Divider, Checkbox } from "@mui/material";
import { EditIcon, DeleteIcon, StarIcon } from "@/ui/icons";
import { Row, Col, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardAuthor } from "@/components/BoardAuthor";
import { Tooltip } from "@/ui/tools/Tooltip";
// logic
import { useMemo, useState, MouseEvent, ChangeEvent, useEffect } from "react";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import * as BoardManagerApi from "@/apis/board_managers";
import { useMe } from "@/stores/UserStore";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import type { BoardManagerT } from "@/types";


type ManagerRoleDetailT = {
  name: string;
  detail: string;
};

type BoardManagerRoleT = "manage_censor" | "manage_manager" | "manage_muter" | "manage_write" | "manage_intro" | "manage_info" | "manage_exposure" | "manage_contents" | "manage_etc";


type ManagerRoleItemProps = {
  manager: BoardManagerT;
  onUpdated: (manager: BoardManagerT) => void;
  onDeleted: (manager: BoardManagerT) => void;
};

export function ManagerItem({
  manager,
  onUpdated,
  onDeleted,
}: ManagerRoleItemProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ManagerTab.ManagerItem");

  const ROLE_DICT: { [key in BoardManagerRoleT]: ManagerRoleDetailT } = {
    manage_censor: {
      name: t("contentCensor"),
      detail: t("contentCensorDetail"),
    },
    manage_manager: {
      name: t("manageManager"),
      detail: t("manageManagerDetail"),
    },
    manage_muter: {
      name: t("manageMuter"),
      detail: t("manageMuterDetail"),
    },
    manage_write: {
      name: t("manageWrite"),
      detail: t("manageWriteDetail"),
    },
    manage_intro: {
      name: t("manageIntro"),
      detail: t("manageIntroDetail"),
    },
    manage_info: {
      name: t("manageInfo"),
      detail: t("manageInfoDetail"),
    },
    manage_exposure: {
      name: t("manageExposure"),
      detail: t("manageExposureDetail") ,
    },
    manage_contents: {
      name: t("manageContent"),
      detail: t("manageContentDetail"),
    },
    manage_etc: {
      name: t("manageEtc"),
      detail: t("manageEtcDetail"),
    },
  };

  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();

  const me = useMe();
  const boardMain$ = useBoardMain$();
  const boardMainAct = useBoardMainActions();

  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [editingManager, setEditingManager] = useState<BoardManagerT>({
    ...manager,
  });

  const checkedRoles = useMemo(() => {
    const roles = Object.keys(ROLE_DICT);
    return roles.filter((role) => {
      const checked = manager[role as BoardManagerRoleT];
      return checked;
    });
  }, [manager]);

  const isMine = me && me.id === manager.user_id;
  // 내가 권한이 있고, 슈퍼가 아니면
  const isEditable = boardMain$.data!.manager!.manage_manager && !manager.is_super;

  useEffect(() => {
    if (editorOpen) {
      setEditingManager(manager);
    }
  }, [editorOpen]);

  function _checkManagerHasEveryRole(_manager: BoardManagerT): boolean {
    for (const role of Object.keys(ROLE_DICT)) {
      const checked = _manager[role as keyof BoardManagerT];
      if (!checked) {
        return false;
      }
    }
    return true;
  }

  const isManagerEveryRole = useMemo(() => {
    return _checkManagerHasEveryRole(manager);
  }, [manager]);

  const isEveryRoleChecked = useMemo(() => {
    return _checkManagerHasEveryRole(editingManager);
  }, [editingManager]);

  function handleEditClick(e: MouseEvent<HTMLButtonElement>): void {
    e.stopPropagation();
    e.preventDefault();
    setEditorOpen(true);
  }

  async function handleDeleteClick(e: MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    const isOk = await showAlertDialog({
      title: t("deleteManager"),
      body: t("deleteManagerMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await BoardManagerApi.remove(manager.id);
      onDeleted(manager);
      enqueueSnackbar(t("deleteManagerSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("deleteManagerFailed"), { variant: "error" });
    }
  }

  function handleEditorClose(): void {
    setEditorOpen(false);
  }

  function handleEveryRoleCheck(e: ChangeEvent<HTMLInputElement>): void {
    e.stopPropagation();
    const checked = e.target.checked;
    const newManager = {
      ...editingManager,
    };
    for (const role of Object.keys(ROLE_DICT)) {
      newManager[role as BoardManagerRoleT] = checked;
    }
    setEditingManager(newManager);
  }

  function handleRoleCheck(e: ChangeEvent<HTMLInputElement>, role: BoardManagerRoleT): void {
    e.stopPropagation();
    const checked = e.target.checked;
    const newManager = {
      ...editingManager,
    };
    newManager[role] = checked;
    setEditingManager(newManager);
  }

  async function handleEditorSubmit(): Promise<void> {
    if (!editingManager.manage_manager && isMine) {
      const isOk = await showAlertDialog({
        title: t("removeUserManageRight"),
        body: t("removeUserManageRightMsg"),
        useCancel: true,
        useOk: true,
      });
      if (!isOk) {
        return;
      }
    }
    try {
      const form: any = {};
      for (const role of Object.keys(ROLE_DICT)) {
        form[role] = editingManager[role as BoardManagerRoleT];
      }
      const updated = await BoardManagerApi.update(manager.id, form);
      const newManager = {
        ...manager,
        ...updated,
      };
      onUpdated(newManager);
      // re-init access if isMine
      if (isMine) {
        boardMainAct.patchData({ manager: newManager });
      }
      setEditorOpen(false);
      enqueueSnackbar(t("removeUserManageRightSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
    }
  }

  const { downSm, downMd } = useResponsive();

  function renderEditor(): JSX.Element {
    return (
      <Box p={1}>
        <Col>
          <Row>
            <Checkbox
              checked={isEveryRoleChecked}
              onChange={handleEveryRoleCheck}
            />
            <Txt variant='subtitle2'>{t("allRights")}</Txt>
          </Row>
          <Divider />
          {Object.entries(ROLE_DICT).map(([role, detail]) => {
            const checked = editingManager[role as BoardManagerRoleT] ?? false;
            return (
              <Fragment key={role}>
                <Col>
                  <Row>
                    <Checkbox
                      checked={checked}
                      onChange={(e): void => handleRoleCheck(e, role as BoardManagerRoleT)}
                    />
                    <Txt variant='subtitle2'>{detail.name}</Txt>
                  </Row>
                  <Row>
                    <Gap x={2} />
                    <Txt>{detail.detail}</Txt>
                  </Row>
                </Col>
              </Fragment>
            );
          })}

          <Row justifyContent='flex-end'>
            <Button onClick={handleEditorClose}>
              {t("cancel")}
            </Button>
            <Button
              variant='contained'
              onClick={handleEditorSubmit}
            >
              {t("apply")}
            </Button>
          </Row>
        </Col>
      </Box>
    );
  }

  return (
    <Fragment>
      <Row>
        <Box
          minWidth='90px'
          overflow='scroll'
          sx={{ "&::-webkit-scrollbar": { display: "none" } }}
        >
          <BoardAuthor
            author={manager.author ?? null}
            renderInfo={(): JSX.Element => <AuthorFingerprint isMe={isMine ?? false} />}
          />
        </Box>

        <Expand />

        <Box maxWidth={downMd ? "100px" : "320px"}>
          {Boolean(manager.is_super) || isManagerEveryRole ? (
            <Box
              display='flex'
              justifyContent='flex-end'
              alignItems='center'
              height='50px'
              mr={4}
            >
              {Boolean(manager.is_super) && (
                <Tooltip title='총괄매니저'>
                  <StarIcon
                    color='primary'
                    fontSize='small'
                    sx={{ mr: 0.5 }}
                  />
                </Tooltip>
              )}
              <Txt
                variant='body3'
                fontWeight={700}
                whiteSpace='nowrap'
              >
                {t("allRights")}
              </Txt>
            </Box>
          ) : (
            <Txt
              variant='body3'
              fontWeight={500}
            >
              {checkedRoles.map((role) => (ROLE_DICT as any)[role].name).join(", ")}
            </Txt>
          )}
        </Box>
        <Tooltip
          title={t("edit")}
          disabled={!isEditable}
        >
          <IconButton
            size={downSm ? "small" : "medium"}
            onClick={handleEditClick}
            disabled={!isEditable}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip
          title={t("delete")}
          disabled={!isEditable}
        >
          <IconButton
            size={downSm ? "small" : "medium"}
            onClick={handleDeleteClick}
            disabled={!isEditable}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Row>

      <Dialog
        open={editorOpen}
        onClose={handleEditorClose}
      >
        {renderEditor()}
      </Dialog>
    </Fragment>
  );
}
