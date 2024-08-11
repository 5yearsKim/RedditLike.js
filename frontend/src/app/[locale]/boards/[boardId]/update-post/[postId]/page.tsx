import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ErrorBox } from "@/components/$statusTools";
import * as PostApi from "@/apis/posts";
import { toId } from "@/utils/formatter";
import { UpdatePostPage } from "@/$pages/UpdatePostPage";
import { setupServerSideFetch } from "@/system/server";
import type { GetPostOptionT } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.UpdatePost");
  return {
    title: t("title"),
  };
}

type UpdatePostProps = {
  params: { postId: string };
};

export default async function UpdatePost({ params }: UpdatePostProps): Promise<JSX.Element> {
  const t = await getTranslations("app.UpdatePost");
  const postId = toId(params.postId);

  if (!postId) {
    return <ErrorBox height="60vh" message={t("invalidPostId", { postId: params.postId })} />;
  }

  try {
    setupServerSideFetch();

    const getOpt: GetPostOptionT = {
      $defaults: true,
    };
    const { data: post } = await PostApi.get(postId, getOpt);
    return <UpdatePostPage post={post} />;
  } catch (e) {
    console.warn(e);
    return <ErrorBox height="60vh" message={t("fetchFailed")} />;
  }

}

// type ServerSideProps = {
//   data: UpdatePostPageSsrProps;
// };

// export const getServerSideProps: GetServerSideProps<ServerSideProps, { boardId: string; postId: string }> = async ({
//   params,
// }) => {
//   const { postId: _pid } = params!;
//   const postId = toId(_pid);
//   if (!postId) {
//     return {
//       notFound: true,
//     };
//   }

//   const getOpt: GetPostOptionT = {
//     $defaults: true,
//   };

//   try {
//     const { data: post } = await PostApi.get(postId, getOpt);

//     return {
//       props: {
//         data: {
//           post: post,
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

// export default function View(props: PageProps): JSX.Element {
//   const { data: ssrProps } = props;
//   const post = ssrProps.post;

//   return (
//     <>
//       <Head>
//         <title>(수정){post.title}</title>
//       </Head>
//       <UpdatePostPage {...ssrProps} />
//     </>
//   );
// }
