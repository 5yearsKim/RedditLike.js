import React, { ReactNode } from "react";
import { unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { SocketProvider } from "@/components/$providers/SocketProvider";

import { RecoilProvider } from "@/components/$providers/RecoilProvider";
import { MuiProvider } from "@/ui/systems/MuiProvider";
import { SnackbarProvider } from "@/hooks/Snackbar";
import { MainDrawerLayout } from "@/components/$layouts/MainDrawerLayout";

import { ConfirmDialogShared } from "@/hooks/dialogs/ConfirmDialog";
import { LoginDialogShared } from "@/hooks/dialogs/LoginDialog";
import { ImageCropperDialogShared } from "@/hooks/dialogs/ImageCropperDialog";
import { PostDialogShared } from "@/hooks/dialogs/PostDialog";
import { BlockAuthorDialogShared } from "@/hooks/dialogs/BlockAuthorDialog";
import { ReportDialogShared } from "@/hooks/dialogs/ReportDialog";


import { MeProvider } from "@/components/$providers/MeProvider";
import { NavbarLayout } from "@/components/$layouts/NavbarLayout";

import { STAGE } from "@/config";

import "react-toastify/dist/ReactToastify.css";
import "@/ui/globals.scss";
import "@/components/RichEditor2/style.scss";


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
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <RecoilProvider>
            <SocketProvider>
              <MuiProvider>
                <SnackbarProvider>

                  <ConfirmDialogShared />
                  <LoginDialogShared />

                  {/* TODO */}

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