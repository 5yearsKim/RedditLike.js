import React, { cache } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { ErrorBox } from "@/components/$statusTools";
import { userTH } from "@/system/token_holders";
import { toId } from "@/utils/formatter";
import { extractText } from "@/utils/html";
import { buildImgUrl } from "@/utils/media";
import * as PostApi from "@/apis/posts";
import { PostPage } from "@/$pages/PostPage";
import type { GetPostOptionT } from "@/types";

import {server} from '@/system/server'

type MetadataProps = {
  params: { postId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const getPost = cache(async (postId: idT) => {
  const rsp = await PostApi.get(postId, {});
  return rsp.data;
});;

export async function generateMetadata(
  { params }: MetadataProps,
): Promise<Metadata> {
  try {

    server.defaults.baseURL = 'http://backend:3030'

    const post = await getPost(parseInt(params.postId));

    let description = extractText(post.body ?? "", post.body_type);
    if (description.length > 300) {
      description = description.slice(0, 300);
    }

    const ogThumbnail = post.thumb_path ?
      buildImgUrl(null, post.thumb_path) :
      undefined;


    return {
      title: post.title,
      description: description,
      openGraph: {
        type: "website",
        title: post.title,
        description: description,
        images: ogThumbnail ? [ogThumbnail] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: description,
        images: ogThumbnail ? [ogThumbnail] : [],
      },
    };

  } catch (e) {
    const t = await getTranslations("app.PostMain");
    return {
      title: t("title"),
    };
  }

}


type PostMainProps = {
  params: {postId: string, groupKey: string}
}

export default async function PostMain({ params }: PostMainProps): Promise<JSX.Element> {
  const t = await getTranslations("app.PostMain");
  const postId = toId(params.postId);

  if (!postId) {
    return <ErrorBox height="60vh" message={t("invalidPostId", { postId: params.postId })} />;
  }


  try {
    // const start = Date.now();

    const getOpt: GetPostOptionT = {
      $defaults: true,
      $manager_defaults: true,
      $user_defaults: true,
      $board: true,
      $pin: true,
    };

    server.defaults.baseURL = 'http://backend:3030'

    const { data: post } = await userTH.serverFetchWithCookie(cookies, async () => {
      return await PostApi.get(postId, getOpt);
    });

    // const stop = Date.now();
    // console.log(`Time Taken to fetch post = ${(stop - start) / 1000} seconds`);

    return (
      <PostPage post={post}/>
    );
  } catch (e: any) {
    console.warn(e);

    const errData = e?.response?.data;
    let message: string|undefined = undefined;

    if (errData.code == "WRONG_GROUP") {
      message = t("wrongGroup");
    }
    return (
      <ErrorBox
        height='60vh'
        message={message ?? t("fetchFailed")}
        showHome
      />
    );
  }
}


// type ServerSideProps = {
//   data: PostPageSsrProps;
// };

// export const getServerSideProps: GetServerSideProps<ServerSideProps, { postId: string }> = async ({
//   params,
//   req,
//   res,
// }) => {
//   const { postId: _pid } = params!;
//   const postId = toId(_pid);
//   if (!postId) {
//     return {
//       notFound: true,
//     };
//   }

//   userTH.initFromCookie(userTH.option.key ,{ req, res });

//   const getOpt: GetPostOptionT = {
//     $defaults: true,
//     $manager_defaults: true,
//     $user_defaults: true,
//     $board: true,
//     $pin: true,
//   };

//   try {
//     const { data: post } = await PostApi.get(postId, getOpt);

//     return {
//       props: {
//         data: {
//           post,
//         },
//       },
//     };
//   } catch (e) {
//     console.warn(e);
//     return {
//       notFound: true,
//     };
//   }
// };

// type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

// export default function PostPageView(props: PageProps): JSX.Element {
//   const { data } = props;

//   const { post } = data;

//   const description = useMemo(() => {
//     return extractText(post.body ?? "", post.body_type);
//   }, []);

//   const ogThumbnail = post.thumb_path ?
//     buildImgUrl(null, post.thumb_path) :
//     (post.board?.avatar_path ?
//       buildImgUrl(null, post.board.avatar_path)
//       : "https://nucostory.com/nuco_og.png");

//   const structuredLd: any = {
//     "@context": "https://schema.org/",
//     "@type": "BlogPosting",
//     headline: post.title,
//     description: description,
//     datePublished: post.published_at,
//     dateModified: post.rewrite_at,
//     url: `https://nucostory.com/posts/${post.id}`,
//     // 'datePublished': '2015-02-05T08:00:00+08:00',
//     // 'dateModified': '2015-02-05T09:20:00+08:00',
//   };

//   console.log(structuredLd);

//   if (post.thumb_path) {
//     structuredLd.image = [buildImgUrl(null, post.thumb_path)];
//   }

//   let shortDescription = description;
//   if (shortDescription.length > 100) {
//     shortDescription = shortDescription.slice(0, 100);
//   }

//   return (
//     <>
//       <Head>
//         <title>{post.title}</title>
//         <meta
//           name='description'
//           content={shortDescription}
//         />

//         {/* og */}
//         <meta
//           property='og:url'
//           content={`https://nucostory.com/posts/${post.id}`}
//         />
//         <meta
//           property='og:type'
//           content='website'
//         />
//         <meta
//           property='og:title'
//           content={post.title}
//         />
//         <meta
//           property='og:description'
//           content={shortDescription}
//         />
//         <meta
//           property='og:image'
//           content={ogThumbnail}
//         />

//         <script
//           type='application/ld+json'
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredLd) }}
//         />
//       </Head>

//       <PostPage {...data} />
//     </>
//   );
// }
