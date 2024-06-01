"use client";
import React from "react";
import { LoadingBox, ErrorBox } from "@/components/$statusTools";
import { useParams } from "next/navigation";
import { useUser$ } from "@/stores/UserStore";
import { PointRouter } from "./router";
import { PointLayout } from "./layout";

export function PointPage(): JSX.Element {
  const user$ = useUser$();
  const { tab } = useParams();

  if (!tab || user$.status === "loading" || user$.status == "init") {
    return <LoadingBox />;
  }

  if (user$.status == "error" || user$.data.me == null ) {
    return (
      <ErrorBox
        height='60vh'
        message='로그인 후 페이지에 접근할 수 있어요.'
        showHome
      />
    );
  }

  return (
    <PointLayout tab={tab as string}>
      <PointRouter
        tab={tab as string}
        me={user$.data.me}
      />
    </PointLayout>
  );
}