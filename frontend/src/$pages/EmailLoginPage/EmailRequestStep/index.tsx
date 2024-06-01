"use client";
import React, { useState, ChangeEvent } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { TextField, InputAdornment, Button } from "@mui/material";
import { Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EmailIcon } from "@/ui/icons";
import { LoadingIndicator } from "@/components/$statusTools";

// logic
import { useTextForm } from "@/hooks/TextForm";
import { useSnackbar } from "@/hooks/Snackbar";
import { emailValidator } from "@/utils/validator";
import * as EmailVerificationApi from "@/apis/email_verifications";


type EmailRequestStepProps = {
  onRequested: (email: string) => void;
};

export function EmailRequestStep({
  onRequested,
}: EmailRequestStepProps): JSX.Element {
  const t = useTranslations("pages.EmailLoginPage.EmailRequestStep");
  const locale = useLocale();

  const {
    val: email,
    setVal: setEmail,
    isValid: isEmailValid,
    errText: emailErrText,
  } = useTextForm("", {
    validators: [emailValidator()],
  });
  const submitDisable = !isEmailValid;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>): void {
    setEmail(e.target.value);
  }

  async function handleRequestClick(): Promise<void> {
    try {
      setIsSubmitting(true);
      await EmailVerificationApi.request(email, { locale } );
      onRequested(email);
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("verificationRequestFailed"), { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Col alignItems='center'>
      <Txt variant='h6'>{t("pleaseTypeEmail")}</Txt>

      <Gap y={1} />

      <Txt color='vague.main'>{t("noNeedPassword")}</Txt>

      <Gap y={2} />

      <TextField
        value={email}
        onChange={handleEmailChange}
        fullWidth
        autoComplete='off'
        error={Boolean(emailErrText)}
        helperText={emailErrText}
        type='email'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />

      <Gap y={2} />
      {isSubmitting ? (
        <LoadingIndicator size='1.5rem' />
      ) : (
        <Button
          disabled={submitDisable}
          variant='contained'
          onClick={handleRequestClick}
        >
          {t("verify")}
        </Button>
      )}
    </Col>
  );
}
