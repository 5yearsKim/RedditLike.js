"use client";
import React, { Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Clickable } from "@/ui/tools/Clickable";
import { Txt } from "@/ui/texts";
import { Col, Box, Center } from "@/ui/layouts";
import { PostMiniPreview } from "@/components/PostMiniPreview";
// logic
import { useState, useEffect, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useRecentPosts } from "@/stores/RecentPostsStore";
import type { PostT } from "@/types";


export function RecentPostList(): ReactNode {
  const t = useTranslations("pages.FeedPage.RecentPostList");
  const router = useRouter();
  const recentPosts$ = useRecentPosts();
  const [posts, setPosts] = useState<PostT[]>([]);

  // to prevent ssr error
  useEffect(() => {
    setPosts(recentPosts$.data);
  }, [recentPosts$.data]);

  function handlePostClick(e: MouseEvent<HTMLElement>, post: PostT): void {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/posts/${post.id}`);
  }

  if (recentPosts$.data.length == 0) {
    return (
      <Center pb={2} pt={1}>
        <Txt variant='body3' color='vague.main'>{t("noRecentPosts")}</Txt>
      </Center>
    );
  }

  return (
    <Col>
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
    </Col>
  );
}
