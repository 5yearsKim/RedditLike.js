"use client";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useParams } from "next/navigation";

import { Container, Box, Row, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardThemeProvider } from "@/ui/tools/BoardThemeProvider";
import { EditIcon } from "@/ui/icons";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { PostEditor } from "@/components/PostEditor";
import { vizTime } from "@/utils/time";
// logic
import { useState, useEffect, useRef } from "react";
import * as PostApi from "@/apis/posts";
import { useMe } from "@/stores/UserStore";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { PostEditorT, XPostDataT } from "@/components/PostEditor";
import { toId } from "@/utils/formatter";
import { sleep } from "@/utils/misc";
import type { PostT, PostFormT } from "@/types";


export type UpdatePostPageSsrProps = {
  post: PostT;
};


export function UpdatePostPage({ post }: UpdatePostPageSsrProps) {
  const t = useTranslations("pages.UpdatePostPage");
  const locale = useLocale();

  const editorRef = useRef<PostEditorT | null>(null);
  const me = useMe();
  const router = useRouter();
  const { boardId } = useParams();

  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const boardMain$ = useBoardMain$();
  const boardMainAct = useBoardMainActions();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isDraft = !post.published_at;

  useEffect(() => {
    const bid = toId(boardId);
    if (!bid) {
      // if bid == 0
      console.log(`invalid arguments bid ${bid} or not logged in`);
    } else {
      boardMainAct.load({ id: bid });
    }
  }, [me]);

  async function handleSubmit(form: PostFormT, xData: XPostDataT): Promise<PostT | void> {
    const board = boardMain$.data!.board;
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
      if (isDraft) {
        form.published_at = new Date();
      } else {
        form.rewrite_at = new Date();
      }
      const created = await PostApi.update(post.id, form, xData);
      editorRef.current?.reset();
      enqueueSnackbar(t("createPostSuccess"), { variant: "success" });
      await sleep(100);
      router.push(`/posts/${created.id}`);
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
      await PostApi.update(post.id, form, xData);
      enqueueSnackbar(t("draftSaveSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
    }
  }

  const { status } = boardMain$;

  if (!me) {
    return (
      <ErrorBox
        height='60vh'
        message={t("loginOnly")}
        showHome
      />
    );
  }
  if (status === "init") {
    return <InitBox height='60vh' />;
  }
  if (status === "loading") {
    return <LoadingBox height='60vh' />;
  }


  const { board, author, manager } = boardMain$.data!;

  const postErr = post.board_id !== board.id || post.author_id !== me.id;
  if (status === "error" || postErr) {
    return (
      <ErrorBox
        height='60vh'
        showHome
      />
    );
  }

  return (
    <Container>
      <BoardThemeProvider board={board}>
        <>
          {!isDraft && (
            <>
              <Box my={2}>
                <Row>
                  <Txt
                    variant='body2'
                    fontWeight={500}
                  >
                    {t("publishedAt")}: {vizTime(post.published_at, { type: "absolute", locale })}
                  </Txt>
                  <Expand />
                  <Row>
                    <EditIcon
                      fontSize='small'
                      sx={{ color: "vague.light" }}
                    />
                    <Gap x={1} />
                    <Txt
                      color='vague.main'
                      variant='body2'
                      fontWeight={500}
                    >
                      {t("editing")}
                    </Txt>
                  </Row>
                </Row>
              </Box>
            </>
          )}
          <Box
            maxWidth={800}
            margin='auto'
          >
            <PostEditor
              ref={editorRef}
              author={author!}
              me={me}
              post={post}
              board={board}
              isManager={Boolean(manager)}
              submitDisabled={isSubmitting}
              saveDraft={isDraft}
              loadDraft={false}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onDraftSave={handleDraftSave}
            />
          </Box>
        </>
      </BoardThemeProvider>
    </Container>
  );
}

// <Row>
//   <Txt variant='h5'>{board.name}</Txt>

//   <Expand/>

//   <DraftPostBox
//     boardId={board.id}
//     currentPostId={postId}
//     myId={me?.id ?? 0}
//     onApply={handleDraftApply}
//   />
//   <Box mr={1}/>
//   <Button
//     variant='outlined'
//     disabled={isSubmitting}
//     startIcon={<EditIcon/>}
//     onClick={handleDraftSave}
//   >
//     임시저장
//   </Button>
// </Row>
