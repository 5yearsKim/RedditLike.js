import React, { ChangeEvent, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { TextField, Button, CircularProgress } from "@mui/material";
import { Box, Col, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import Link from "next/link";
// logic
import * as AuthApi from "@/apis/auth";
import { useUserActions } from "@/stores/UserStore";
import { useSnackbar } from "@/hooks/Snackbar";

type VerificationStepProps = {
  email: string;
  onVerified: () => void;
};

export function VerificationStep({
  email,
  onVerified,
}: VerificationStepProps): JSX.Element {
  const t = useTranslations("pages.EmailLoginPage.VerificationStep");

  const userAct = useUserActions();
  const { enqueueSnackbar } = useSnackbar();

  const [code, setCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(180);

  const submitDisable = code == "" || countdown <= 0;

  useEffect(() => {
    const countFnc = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => clearInterval(countFnc);
  }, [countdown]);

  function handleCodeChange(e: ChangeEvent<HTMLInputElement>): void {
    setCode(e.target.value);
  }

  async function handleSubmit(): Promise<void> {
    try {
      setIsSubmitting(true);
      const session = await AuthApi.emailLogin(email, code);
      userAct.loadFromSession(session);
      enqueueSnackbar(t("loginSuccess", { email }), { variant: "success" });
      onVerified();

    } catch (e: any) {
      const errCode = e.response?.data?.code;
      let errMessage = e.response?.data?.message;
      if (errCode == "FORBIDDEN") {
        if (errMessage.startsWith("VERIFICATION_NOT_EXIST")) {
          errMessage = t("verificationNotExist");
        } else if (errMessage.startsWith("TRIAL_OVER")) {
          errMessage = t("trialOver");
        } else if (errMessage.startsWith("INVALID_CODE")) {
          errMessage = t("invalidCode");
        }
        enqueueSnackbar(errMessage, { variant: "error" });
      } else {
        console.warn(e);
        enqueueSnackbar(t("verifyFaield"), { variant: "error" });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderTimer(): JSX.Element {
    const min = Math.floor(countdown / 60);
    let sec = `${countdown % 60}`;
    if (sec.length == 1) {
      sec = "0" + sec;
    }

    return (
      <Box mx={0.5}>
        <Txt
          color='#ff0000'
          variant='body2'
        >
          {min}:{sec}
        </Txt>
      </Box>
    );
  }

  return (
    <Col alignItems='center'>
      <Txt textAlign='center' variant='subtitle2'>
        {t("codeSent", { email })}
      </Txt>

      <Gap y={2} />

      <Row alignItems='end'>
        <TextField
          label={t("verificationCode")}
          value={code}
          autoComplete='off'
          variant='standard'
          onChange={handleCodeChange}
          InputProps={{
            endAdornment: renderTimer(),
          }}
        />

        <Gap x={1}/>

        {isSubmitting ? (
          <CircularProgress size='1.5rem' />
        ) : (
          <Button
            onClick={handleSubmit}
            variant='contained'
            disabled={submitDisable}
          >
            {t("verify")}
          </Button>
        )}
      </Row>

      <Gap y={2} />

      {countdown <= 0 && (
        <Col alignItems='center'>
          <Txt color='vague.main'>{t("timeOver")}</Txt>

          <Gap y={1} />

          <Link href='/'>
            <Button variant='contained'>{t("toHome")}</Button>
          </Link>
        </Col>
      )}
    </Col>
  );
}
