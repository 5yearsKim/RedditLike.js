"use client";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/ui/layouts";
import { BoardThemeProvider } from "@/ui/tools/BoardThemeProvider";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { Box } from "@mui/material";
import { PostEditor, type XPostDataT } from "@/components/PostEditor";
// logic
import { useRouter, useParams } from "next/navigation";
import { useMe, useMeMuter } from "@/stores/UserStore";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import { PostEditorT } from "@/components/PostEditor";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import * as PostApi from "@/apis/posts";
import { toId } from "@/utils/formatter";
import type { PostT, PostFormT } from "@/types/Post";


export function CreatePostPage(): ReactNode {
  const t = useTranslations("pages.CreatePostPage");
  const me = useMe();
  const muter = useMeMuter();
  const router = useRouter();
  const { boardId } = useParams();
  const editorRef = useRef<PostEditorT | null>(null);

  const boardMain$ = useBoardMain$();
  const boardMainAct = useBoardMainActions();

  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const bid = toId(boardId);
    if (!bid) {
      // if bid == 0
      console.log(`invalid arguments bid ${boardId} or not logged in`);
    } else {
      boardMainAct.load({ id: bid });
    }
  }, [me]);

  const status = boardMain$.status;

  if (status === "init") {
    return <InitBox height='60vh' />;
  }
  if (status === "loading") {
    return <LoadingBox height='60vh' />;
  }
  if (status === "error") {
    return <ErrorBox height='60vh' />;
  }

  if (!me) {
    return (
      <ErrorBox
        height='60vh'
        message={t("loginOnly")}
        showHome
      />
    );
  }

  if (muter) {
    return (
      <ErrorBox
        height='60vh'
        message={t("groupRestricted")}
        showHome
      />
    );
  }

  const { board, author, manager } = boardMain$.data!;

  // manager only 기능은 백엔드 쪽에서 막아둠
  if (board.allow_post_manager_only && !author?.is_manager) {
    return (
      <ErrorBox
        height='60vh'
        message={t("managerOnly")}
        showHome
      />
    );
  }


  async function handleSubmit(form: PostFormT, xData: XPostDataT): Promise<PostT | void> {
    if (board.force_flag && !xData.flags?.length) {
      await showAlertDialog({
        body: t("shouldFlag", { boardName: board.name }),
        useOk: true,
      });
      return;
    }
    if (!form.title) {
      await showAlertDialog({
        body: t("shouldTitle"),
        useOk: true,
      });
      return;
    }
    try {
      setIsSubmitting(true);
      form.published_at = new Date();
      const created = await PostApi.create(form, xData);
      editorRef.current?.reset();
      enqueueSnackbar(t("createPostSuccess"), { variant: "success" });
      router.push(`/boards/${created.board_id}?sort=recent&refresh=true`);
      return created;
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancel(form: PostFormT, xData: XPostDataT): Promise<void> {
    const hasContent = form.title || form.body || xData.images?.length || xData.videos?.length;

    if (hasContent) {
      const isOk = await showAlertDialog({
        title: t("cancelPost"),
        body: t("cancelPostMsg"),
        useCancel: true,
        useOk: true,
      });
      if (!isOk) {
        return;
      }
    }
    editorRef.current?.reset();
    router.push(`/boards/${board.id}`);
  }

  async function handleDraftSave(form: PostFormT, xData: XPostDataT): Promise<void> {
    if (!form.title.length) {
      await showAlertDialog({
        body: t("draftShouldTitle"),
        useOk: true,
      });

      return;
    }

    try {
      form.published_at = null;
      await PostApi.create(form, xData);
      editorRef.current?.reset();
      enqueueSnackbar(t("draftSuccess"), { variant: "success" });
      router.push(`/boards/${board.id}`);
    } catch (e) {
      enqueueSnackbar(t("draftFailed"), { variant: "error" });
      console.warn(e);
    }
  }


  return (
    <Container>
      <BoardThemeProvider board={board}>
        <Box
          maxWidth={800}
          margin='auto'
        >
          <PostEditor
            ref={editorRef}
            author={author!}
            me={me}
            board={board}
            isManager={Boolean(manager)}
            submitDisabled={isSubmitting}
            saveDraft
            loadDraft
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onDraftSave={handleDraftSave}
          />
        </Box>
      </BoardThemeProvider>
    </Container>
  );
}
