"use client";
import React, { Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Col, Row, Box, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Button } from "@mui/material";
import { PostMiniPreview } from "@/components/PostMiniPreview";
import { InitBox, LoadingIndicator, ErrorButton } from "@/components/$statusTools";
import { Clickable } from "@/ui/tools/Clickable";
// logic
import { useEffect, MouseEvent } from "react";
import { useHotPostsStore, getHotPostsListOpt } from "@/stores/HotPostsStore";
import { useMe } from "@/stores/UserStore";
import type { PostT } from "@/types";

export function HotPostList(): ReactNode {
  const t = useTranslations("pages.FeedPage.HotPostList");
  const router = useRouter();
  const me = useMe();

  const listOpt = getHotPostsListOpt({ userId: me?.id });

  const { data: hotPosts$, actions: hotPostsAct } = useHotPostsStore();

  useEffect(() => {
    hotPostsAct.load(listOpt);
  }, [me?.id]);

  function handleErrorRetry(): void {
    hotPostsAct.load(listOpt, { force: true });
  }

  function handlePostClick(e: MouseEvent<HTMLElement>, post: PostT): void {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/posts/${post.id}`);
  }

  const { status, data: posts } = hotPosts$;

  if (status === "init") {
    return <InitBox />;
  }
  if (status === "loading") {
    return (
      <Row
        width='100%'
        justifyContent='center'
      >
        <LoadingIndicator />
      </Row>
    );
  }

  if (status === "error") {
    return (
      <Row
        width='100%'
        justifyContent='center'
      >
        <ErrorButton onRetry={handleErrorRetry} />
      </Row>
    );
  }

  return (
    <Col>
      {posts.length == 0 && (
        <Center p={1}>
          <Txt variant="body3" color='vague.main'>{t("noHotPosts")}</Txt>
        </Center>
      )}
      {posts.map((post) => {
        return (
          <Fragment key={post.id}>
            <Clickable
              aria-label={"post-" + post.title}
              borderRadius={0}
              onClick={(e): void => handlePostClick(e, post)}
            >
              <Box
                px={1}
                py={0.5}
                width='100%'
              >
                <PostMiniPreview post={post} />
              </Box>
            </Clickable>
          </Fragment>
        );
      })}
      <Link href='/hots'>
        <Button
          fullWidth
          size='small'
        >
          {t("showAll")}
        </Button>
      </Link>
    </Col>
  );
}
