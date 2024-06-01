import React, { useEffect, MouseEvent, Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useResponsive } from "@/hooks/Responsive";
import { Col, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ListView, AppendError, AppendLoading } from "@/ui/tools/ListView";
import { InitBox, ErrorBox } from "@/components/$statusTools";
import { PostPreview, PostPreviewSkeleton, type PostPreviewProps } from "@/components/PostPreview";
import { VirtualScrollItem } from "@/ui/tools/VirtualScrollItem";
// logic
import { atom } from "recoil";
import { useListDataStore, ListDataT } from "@/stores/molds/list_data";
import { usePostDialog } from "@/hooks/dialogs/PostDialog";
import * as PostApi from "@/apis/posts";
import { updatePostEv } from "@/system/global_events";
import { useRecentPosts } from "@/stores/RecentPostsStore";
import type { ListPostOptionT, PostT } from "@/types";

const postListState = atom<ListDataT<PostT, ListPostOptionT>>({
  key: "postListState",
  default: {
    status: "init",
    data: [],
    listArg: {} as ListPostOptionT,
    nextCursor: null,
    appendingStatus: "init",
    lastUpdated: null,
  },
});


type PostListProps = {
  // height?: number|string
  listOpt: ListPostOptionT;
  regenCnt?: number;
  getPostProps: (post: PostT) => PostPreviewProps
};


export function PostList({
  listOpt,
  regenCnt,
  getPostProps,
}: PostListProps): ReactNode {
  const t = useTranslations("components.PostList");

  const recentPosts$ = useRecentPosts();

  // useEffect(() => {
  //   const listener = (e: Event) => {
  //     console.log('listen event', e);
  //   };
  //   console.log('listenr registerd');
  //   window.addEventListener('updatepost', listener);
  //   return window.removeEventListener('updatepost', listener);
  // }, []);

  const { downSm } = useResponsive();

  const { data: posts$, actions: postsAct } = useListDataStore({
    listFn: PostApi.list,
    recoilState: postListState,
    cacheCfg: {
      genKey: (opt) => `post-list-${JSON.stringify(opt)}`,
      ttl: 1000 * 60 * 5,
    },
  });
  const { openPostDialog } = usePostDialog();

  useEffect(() => {
    updatePostEv.addListener("postList", (post) => {
      _handlePostUpdated(post);
    });
    return (): void => {
      updatePostEv.removeListener("postList");
    };
  }, [posts$?.data]);


  useEffect(() => {
    // console.log('effect', listOpt);
    postsAct.load(listOpt);
  }, [JSON.stringify(listOpt)]);

  // update the most recent item as checked.. for mobile back check
  useEffect(() => {
    const recentPosts = recentPosts$.data;
    if (recentPosts.length <= 0) {
      return;
    }
    const rPost = recentPosts[0]; // mmost recentPost
    const foundIdx = posts$.data.findIndex((item) => item.id == rPost.id);
    if (foundIdx < 0) {
      return;
    }
    const found = posts$.data[foundIdx];
    if (!found.check) {
      postsAct.replaceItem({ ...found, check: new Date() as any });
    }
  }, []);

  useEffect(() => {
    if (regenCnt) {
      // regenCnt exsts and regenCnt > 0
      postsAct.load(listOpt, { force: true });
    }
  }, [regenCnt]);

  function handleErrorRetry(): void {
    postsAct.load(listOpt, { force: true });
  }

  function handleLoadMore(): void {
    if (posts$.appendingStatus === "loaded") {
      postsAct.refill();
    }
  }

  function handleRefillRetry(): void {
    postsAct.refill();
  }

  function _handlePostUpdated(post: PostT): void {
    if (!posts$.data.some((item) => item.id == post.id)) {
      return;
    }
    postsAct.replaceItem(post);
  }

  function handlePostPreviewClick(e: MouseEvent<HTMLElement>, post: PostT): void {
    if (downSm) {
      // pass
    } else {
      e.preventDefault();
      e.stopPropagation();
      openPostDialog(post);
    }
  }


  // // for skeleton
  // const [toggle, setToggle] = React.useState(false);
  // React.useEffect(() => {
  //   const intervalID = setInterval(() =>  {
  //     setToggle((toggle) => !toggle);
  //   }, 1000);

  //   return () => clearInterval(intervalID);
  // }, []);

  const { status, appendingStatus, data: posts } = posts$;

  // return (
  //   <>
  //     {[1, 2, 3].map((idx) => (
  //       <Fragment key={idx}>
  //         <PostPreviewSkeleton size={downSm ? 'small' : 'medium'}/>
  //         <Box mt={1}/>
  //       </Fragment>
  //     ))}
  //   </>
  // );

  if (status === "init") {
    return <InitBox height='60vh' />;
  }
  if (status === "loading") {
    return (
      <>
        {[1, 2, 3, 4].map((num) => {
          return (
            <Fragment key={num}>
              <PostPreviewSkeleton size={downSm ? "small" : "medium"} />
              <Box mb={downSm ? 1 : 1.2} />
            </Fragment>
          );
        })}
      </>
    );
  }
  if (status === "error") {
    return (
      <ErrorBox
        height='60vh'
        onRetry={handleErrorRetry}
      />
    );
  }

  if (posts.length == 0) {
    return (
      <Box>
        <Txt
          variant='subtitle2'
          color='vague.main'
          textAlign='center'
        >
          {t("noPosts")}
        </Txt>
      </Box>
    );
  }


  return (
    <Col rowGap={1}>
      <ListView
        data={posts}
        onLoaderDetect={handleLoadMore}
        renderItem={(post, idx): ReactNode => {
          const forceRender = idx < 12;

          const postProps = getPostProps(post);

          return (
            <Fragment key={`post-${post.id}`}>
              <Link href={`/posts/${post.id}`}>
                <VirtualScrollItem
                  minHeight={100}
                  forceRender={forceRender}
                >
                  {/* <ShallowLink post={post}> */}
                  <Box
                    mb={downSm ? undefined : 0.2}
                    onClick={(e): void => handlePostPreviewClick(e, post)}
                  >
                    <PostPreview {...postProps}/>
                  </Box>
                </VirtualScrollItem>
              </Link>
            </Fragment>
          );
        }}
        renderAppend={(): JSX.Element => {
          if (appendingStatus === "loading") {
            return <AppendLoading />;
          }
          if (appendingStatus === "error") {
            return <AppendError onRetry={handleRefillRetry} />;
          }
          return <></>;
        }}
      />
    </Col>
  );
}
