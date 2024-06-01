"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/hooks/Snackbar";
import { useUrlState } from "@/hooks/UrlState";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import { useMe } from "@/stores/UserStore";
import * as BoardUserApi from "@/apis/board_users";
import * as XBoardUserFlairApi from "@/apis/x_board_user_flair";
import type { FlairT, BoardUserFormT } from "@/types";

export type AuthorPreviewProps = {
  boardId: idT;
  createPostDisabled?: boolean;
  // board:  BoardT
  // boardInfo: BoardInfoT
  // author: AuthorT|null
  // isManager: boolean
  // onAuthorUpdated: (author: AuthorT) => void
};

export function useLogic(props: AuthorPreviewProps) {
  const { boardId, createPostDisabled } = props;
  const router = useRouter();
  const t = useTranslations("pages.BoardMainPage.AuthorPreview");

  const { enqueueSnackbar } = useSnackbar();
  const [selectorOpen, setSelectorOpen] = useUrlState<boolean>({
    key: "authorSelectorOpen",
    query2val: (query) => query === "true",
    val2query: (val) => val ? "true" : "false",
    backOn: (val) => !val,
  });

  const boardMain$ = useBoardMain$();
  const boardMainAct = useBoardMainActions();
  const me = useMe();

  function handleEditAuthorClick(): void {
    setSelectorOpen(true);
  }

  function handleSelectorClose(): void {
    setSelectorOpen(false);
  }

  async function handleSelectorApply(data: {
    flairs?: FlairT[];
    nickname: string | null;
    avatarPath: string | null;
  }): Promise<void> {
    try {
      const form: BoardUserFormT = {
        user_id: me!.id,
        board_id: boardId,
        nickname: data.nickname,
        avatar_path: data.avatarPath,
      };
      const boardUser = await BoardUserApi.create(form);
      const flairIds = (data.flairs ?? []).map((flair) => flair.id);
      await XBoardUserFlairApi.linkMe(boardUser.board_id, flairIds);
      const { data: fetched } = await BoardUserApi.getAuthor(boardId);
      boardMainAct.patchData({ author: fetched });
      enqueueSnackbar(t("updateSuccess"), { variant: "success" });
      setSelectorOpen(false);
    } catch (e) {
      enqueueSnackbar(t("updateFailed"), { variant: "error" });
    }
  }

  function handleCreatePostClick(): void {
    router.push(`/boards/${boardId}/create-post`);
  }

  return {
    boardId,
    boardMain$,
    selectorOpen,
    createPostDisabled,
    handleEditAuthorClick,
    handleSelectorApply,
    handleSelectorClose,
    handleCreatePostClick,
  };
}
