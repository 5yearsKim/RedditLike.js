"use client";
import React, { useEffect } from "react";
import { Container, Gap } from "@/ui/layouts";
import { BoardThemeProvider } from "@/ui/tools/BoardThemeProvider";
import { Box, Divider } from "@mui/material";
import { CommentSection } from "./CommentSection";
import { PostItem } from "./PostItem";

// logic
import { usePostMain$, usePostMainActions } from "@/stores/PostMainStore";
import { useBoardMain$, useBoardMainActions } from "@/stores/BoardMainStore";
import { useMe } from "@/stores/UserStore";
import { useRecentPostsActions } from "@/stores/RecentPostsStore";
import * as PostCheckApi from "@/apis/post_checks";
import type { PostT, PostCheckT } from "@/types";


export type PostPageSsrProps = {
  post: PostT;
};


type CheckPostOptionT = {
  type: "ip" | "user";
  onChecked?: (check: PostCheckT) => any;
};

async function checkPost(postId: idT, option: CheckPostOptionT): Promise<void> {
  try {
    const check = await PostCheckApi.check( postId, option.type);
    if (option.onChecked && check) {
      option.onChecked(check);
    }
  } catch (e) {
    console.warn(e);
  }
}

export function PostPage(props: PostPageSsrProps): JSX.Element {
  const { post: ssrPost } = props;

  const postMain$ = usePostMain$();
  const postMainAct = usePostMainActions();

  useEffect(() => {
    postMainAct.set({
      status: "loaded",
      data: {
        post: ssrPost,
      },
      lastUpdated: new Date(),
    });
    return () => {
      postMainAct.reset();
    };
  }, []);

  function handlePostUpdated(post: PostT): void {
    postMainAct.patch({ data: { post } });
  }

  const isCached = !(postMain$.status == "loaded" && postMain$.data?.post?.id == ssrPost.id);
  const validPost = isCached ? ssrPost : postMain$.data!.post!;
  // const validPost = ssrPost;

  return (
    <Container>
      <PostPageContent
        post={validPost}
        isCached={isCached}
        logVisit
        onUpdated={handlePostUpdated}
      />
    </Container>
  );
}


type PostPageContentProps = {
  post: PostT;
  isCached?: boolean;
  logVisit?: boolean;
  onUpdated: (post: PostT) => void;
};

export function PostPageContent({
  post,
  isCached,
  logVisit,
  onUpdated,
}: PostPageContentProps): JSX.Element {
  const me = useMe();
  const recentPostsAct = useRecentPostsActions();

  const boardMainAct = useBoardMainActions();
  const boardMain$ = useBoardMain$();

  useEffect(() => {
    if (logVisit && !isCached) {
      checkPost(post.id, {
        type: me ? "user" : "ip",
        onChecked: (check) => {
          onUpdated({ ...post, check: check });
        },
      });

      recentPostsAct.push(post);
    }
  }, [isCached]);

  useEffect(() => {
    boardMainAct.load({ id: post.board_id });
  }, [post.board_id]);

  return (
    <BoardThemeProvider board={boardMain$.status === "loaded" ? boardMain$.data!.board : null}>
      <Gap y={2} />

      <PostItem
        post={post}
        onUpdated={onUpdated}
      />

      <Divider sx={{ mb: 2 }} />

      <CommentSection post={post} />

      {/* margin */}
      <Box height='100px' />
    </BoardThemeProvider>
  );
}
