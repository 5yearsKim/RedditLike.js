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
import { OAUTH_GOOGLE_ID } from "@/config";
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
    router.push("/email-login");
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
          <GoogleOAuthProvider clientId={OAUTH_GOOGLE_ID}>
            <GoogleLoginButton onSuccess={handleGoogleLoginSuccess}/>
          </GoogleOAuthProvider>

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
        </Col>
      </Box>
    </Dialog>
  );
}
