"use client";

import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dialog, Button } from "@mui/material";
import { Col, Gap, Box } from "@/ui/layouts";
import { useResponsive } from "@/hooks/Responsive";
import { usePostDialog } from "@/hooks/dialogs/PostDialog";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { getAnalytics, logEvent } from "firebase/analytics";
import { EmailIcon } from "@/ui/icons";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { env } from "@/env";
import { useLoginDialog, useLoginDialogValue } from "./hook";


export function LoginDialogShared(): ReactNode {
  const t = useTranslations("hooks.dialogs.LoginDialog");

  const { open } = useLoginDialogValue();
  const { closeLoginDialog } = useLoginDialog();

  const router = useRouter();
  const { closePostDialog } = usePostDialog();

  async function handleGoogleLoginSuccess(): Promise<void> {
    closeLoginDialog();
    closePostDialog();
    router.replace("/");
  }

  function handleEmailLoginClick(): void {
    if (env.TEMPORARY_LOGIN_ONLY) {
      alert("This app is not configured to support email login. (degub: disable TEMPORARY_LOGIN_ONLY)");
      return;
    }
    router.push("/email-login");
    closePostDialog();
    closeLoginDialog();
  }

  function handleTemporaryLoginClick(): void {
    router.push("/temporary-login");
    closePostDialog();
    closeLoginDialog();
  }

  const { downSm } = useResponsive();

  return (
    <Dialog
      open={open}
      onClose={closeLoginDialog}
      disableScrollLock
      fullWidth={downSm ? true : false}
    >
      <Box
        px={downSm ? 1 : 4}
        py={2}
      >
        <Col
          spacing={1}
          alignItems='center'
        >
          { env.OAUTH_GOOGLE_ID !== "" && env.TEMPORARY_LOGIN_ONLY == false && (
            <GoogleOAuthProvider clientId={env.OAUTH_GOOGLE_ID}>
              <GoogleLoginButton onSuccess={handleGoogleLoginSuccess}/>
            </GoogleOAuthProvider>
          )}

          <Button
            variant='contained'
            onClick={handleEmailLoginClick}
            sx={{
              minWidth: 200,
            }}
          >
            <EmailIcon
              sx={{
                width: "26px",
                height: "26px",
                color: "#ffffff",
              }}
            />
            <Gap x={1} />
            {t("loginWithEmail")}
          </Button>
          {env.TEMPORARY_LOGIN_ONLY && (
            <Button
              variant='outlined'
              onClick={handleTemporaryLoginClick}
              sx={{
                minWidth: 200,
              }}
            >
              <EmailIcon
                sx={{
                  width: "26px",
                  height: "26px",
                  color: "primary",
                }}
              />
              <Gap x={1} />
              {t("loginTemporaryAccount")}
            </Button>
          )}
        </Col>
      </Box>
    </Dialog>
  );
}
