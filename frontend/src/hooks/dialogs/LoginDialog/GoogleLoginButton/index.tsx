"use client";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@mui/material";
import * as AuthApi from "@/apis/auth";
import { useUserActions } from "@/stores/UserStore";
import { useSnackbar } from "@/hooks/Snackbar";

type GoogleLoginButtonProps = {
  onSuccess: () => void;
}

export function GoogleLoginButton({
  onSuccess,
}: GoogleLoginButtonProps) {
  const t = useTranslations("hooks.dialogs.LoginDialog.GoogleLoginButton");

  const userAct = useUserActions();
  const { enqueueSnackbar } = useSnackbar();

  const handleGoogleClick = useGoogleLogin({
    onSuccess: async (res) => {
      try {
        const session = await AuthApi.googleLogin(res.access_token);
        userAct.loadFromSession(session);
        onSuccess();
        // enqueueSnackbar(`${session.account.email} 로 로그인 했어요 :)`, { variant: "success" });
        enqueueSnackbar(t("loginSuccess", { email: session.user.email }), { variant: "success" });
      } catch (e) {
        console.warn(e);
        enqueueSnackbar(t("loginFailed"), { variant: "error" });
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <>
      <Button
        variant="contained"
        startIcon={
          <Image
            src='/images/google_logo.png'
            alt='google_logo'
            width={20}
            height={20}
          />
        }
        onClick={() => handleGoogleClick()}
        sx={{
          bgcolor: "#fff",
          color: "#000",
          minWidth: 200,
        }}
      >
        {t("loginWithGoogle")}
      </Button>
      {/* <Button
        onClick={() => AuthApi.googleLogin("ya29.a0AfB_byBSeMCmX17rL1xOI733akHGgu31jmCYIPZUtocvtCe0oGLquuiOgakSjAF7kmePXs-0Zw-5E5r8ZXc1CyncYXvfjj4-mwr35-NaMglOawWndzAOAyD0XoOuaazjqE5G3qTSwwFQL7hVmp_ZZh7fTx_th-xn1bwaCgYKAQMSARASFQGOcNnChCpxyrJTJR9B-3Xdi-AAfg0170")}
      >
        test
      </Button> */}
    </>
  );
}