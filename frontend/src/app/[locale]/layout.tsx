import React, { ReactNode } from "react";
import { unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { SocketProvider } from "@/components/$providers/SocketProvider";

import { RecoilProvider } from "@/components/$providers/RecoilProvider";
import { MuiProvider } from "@/ui/systems/MuiProvider";
import { notoSansKr } from "@/ui/systems/fonts";
import { SnackbarProvider } from "@/hooks/Snackbar";
import { AccountProvider } from "@/components/$providers/AccountProvider";
import { GroupProvider } from "@/components/$providers/GroupProvider";
import { MainDrawerLayout } from "@/components/$layouts/MainDrawerLayout";
import { GroupThemeProvider } from "@/ui/tools/GroupThemeProvider";

import { ConfirmDialogShared } from "@/hooks/dialogs/ConfirmDialog";
import { LoginDialogShared } from "@/hooks/dialogs/LoginDialog";
import { ImageCropperDialogShared } from "@/hooks/dialogs/ImageCropperDialog";
import { PostDialogShared } from "@/hooks/dialogs/PostDialog";
import { BlockAuthorDialogShared } from "@/hooks/dialogs/BlockAuthorDialog";
import { ReportDialogShared } from "@/hooks/dialogs/ReportDialog";
import { Metadata, ResolvingMetadata } from "next";
import * as GroupApi from "@/apis/groups";
import { buildImgUrl } from "@/utils/media";


import { MeProvider } from "@/components/$providers/MeProvider";
import { NavbarLayout } from "@/components/$layouts/NavbarLayout";
import { LRUCache } from "lru-cache";

import { STAGE, LOCALES, GROUP_KEY } from "@/config";
import type { GroupT } from "@/types";


import "react-toastify/dist/ReactToastify.css";
import "@/ui/globals.scss";
import "@/components/RichEditor2/style.scss";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}


type MetadataProps = {
  params: { groupKey: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const groupCache = new LRUCache<string, GroupT>({
  max: 100,
});

const getGroupByKey = async (groupKey: string) => {
  const cached = groupCache.get(groupKey);
  if (cached) {
    return cached;
  }
  const rsp = await GroupApi.getByKey(groupKey);
  const group = rsp.data;
  groupCache.set(groupKey, group);
  return group;
};

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  try {
    const group = await getGroupByKey(params.groupKey);
    return {
      title: group.name,
      description: group.description,
      icons: group.avatar_path ?
        buildImgUrl(null, group.avatar_path) :
        {
          icon: "./icons/nonimos/favicon.ico",
          shortcut: "./icons/nonimos/favicon.ico",
          apple: "./icons/nonimos/apple-touch-icon.png",
        },
      openGraph: {
        title: group.name,
        description: group.description ?? "",
        images: group.avatar_path ? [buildImgUrl(null, group.avatar_path)] : [],
        type: "website",
      },
    };
  } catch (e) {
    const resolved = await parent;
    return {
      title: resolved.title,
      description: resolved.description,
    };
  }
}


export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: {locale: string}
}) {
  unstable_setRequestLocale(locale);

  const messages = useMessages();

  return (
    <html lang={locale} className={notoSansKr.className}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <RecoilProvider>
            <SocketProvider>
              <MuiProvider>
                <SnackbarProvider>
                  <AccountProvider>

                    <ConfirmDialogShared />
                    <LoginDialogShared />


                    {/* TODO */}
                    <GroupProvider groupKey={GROUP_KEY}>
                      <GroupThemeProvider>

                        <ImageCropperDialogShared/>
                        <PostDialogShared/>
                        <BlockAuthorDialogShared/>
                        <ReportDialogShared/>

                        <MeProvider>
                          <NavbarLayout>
                            <MainDrawerLayout/>
                            {children}
                          </NavbarLayout>
                        </MeProvider>

                      </GroupThemeProvider>
                    </GroupProvider>

                  </AccountProvider>
                </SnackbarProvider>
              </MuiProvider>
            </SocketProvider>
          </RecoilProvider>

          {STAGE !== "prod" && (
            <div
              style={{
                position: "fixed",
                bottom: "5px",
                right: "5px",
                color: "red",
                fontWeight: 900,
                fontSize: "1.5rem",
              }}
            >
              {STAGE}
            </div>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}