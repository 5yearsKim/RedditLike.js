import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ErrorBox } from "@/components/$statusTools";
import { cookies } from "next/headers";
import { userTH } from "@/system/token_holders";
import * as BoardApi from "@/apis/boards";
import * as BoardManagerApi from "@/apis/board_managers";
import * as BoardUserApi from "@/apis/board_users";
import * as FlagApi from "@/apis/flags";
import * as BoardRuleApi from "@/apis/board_rules";
import { toId } from "@/utils/formatter";
import { buildImgUrl } from "@/utils/media";
import { BoardMainPage } from "@/$pages/BoardMainPage";

import { LRUCache } from "lru-cache";
import { setupServerSideFetch } from "@/system/server";
import type { GetBoardOptionT, BoardT } from "@/types/Board";

type MetadataProps = {
  params: { boardId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const boardCache = new LRUCache<idT, BoardT>({
  max: 300,
  // how long to live in ms
  ttl: 1000 * 60 * 60 * 1, // 1 hour
});

const getBoard = async (boardId: idT) => {
  const cached = boardCache.get(boardId);
  if (cached) {
    return cached;
  }
  setupServerSideFetch();
  const rsp = await BoardApi.get(boardId, {});
  const board = rsp.data;
  boardCache.set(boardId, board);
  return board;
};

export async function generateMetadata(
  { params }: MetadataProps,
): Promise<Metadata> {
  try {
    const board = await getBoard(parseInt(params.boardId));
    return {
      title: board.name,
      description: board.description,
      // openGraph: {
      //   type: "website",
      //   title: board.name,
      //   description: board.description,
      //   images: board.avatar_path ? [buildImgUrl(null, board.avatar_path)] : [],
      // },
      // twitter: {
      //   card: "summary_large_image",
      //   title: board.name,
      //   description: board.description,
      //   images: board.avatar_path ? [buildImgUrl(null, board.avatar_path)] : [],
      // },
    };
  } catch (e) {
    const t = await getTranslations("app.BoardMain");
    return {
      title: t("title"),
    };
  }
}


type BoardMainProps = {
  params: {boardId: string, groupKey: string}
}

export default async function BoardMain({ params }: BoardMainProps): Promise<JSX.Element> {
  const t = await getTranslations("app.BoardMain");
  const boardId = toId(params.boardId);
  if (!boardId) {
    return (
      <ErrorBox height="60vh" message={t("invalidBoardId", { boardId: params.boardId })}/>
    );
  }


  try {
    // const start = Date.now();

    const getOpt: GetBoardOptionT = {
      $user_defaults: true,
    };
    const [
      { data: board },
      { data: manager },
      { data: author },
      { data: flags },
      { data: rules },
    ] = await userTH.serverFetchWithCookie(cookies, async () => {
      setupServerSideFetch();
      return await Promise.all([
        BoardApi.get(boardId, getOpt),
        BoardManagerApi.getMe(boardId),
        BoardUserApi.getAuthor(boardId),
        FlagApi.list({ boardId }),
        BoardRuleApi.list({ boardId: boardId }),
      ]);
    });

    // const stop = Date.now();
    // console.log(`Time Taken to fetch board = ${(stop - start) / 1000} seconds`);

    return (
      <BoardMainPage
        board={board}
        manager={manager}
        author={author}
        flags={flags}
        rules={rules}
      />
    );
  } catch (e: any) {
    console.warn(e);
    const errData = e?.response?.data;
    const message: string|undefined = undefined;

    console.log("err:, ", errData);

    return (
      <ErrorBox
        height='60vh'
        message={message ?? t("fetchFailed")}
        showHome
      />
    );
  }
}
