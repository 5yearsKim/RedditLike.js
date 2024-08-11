"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, TextField } from "@mui/material";
import { Center, Col, Row, Gap, Container } from "@/ui/layouts";
import { LoadingIndicator } from "@/components/$statusTools";
import { Txt } from "@/ui/texts";
import * as AuthApi from "@/apis/auth";
import { useUserActions } from "@/stores/UserStore";
import { useSnackbar } from "@/hooks/Snackbar";
import { useMe } from "@/stores/UserStore";
import { noEmptyValidator, maxLenValidator } from "@/utils/validator";
import { useTextForm } from "@/hooks/TextForm";


export function TemporaryLoginPage(): JSX.Element {
  const t = useTranslations("pages.TemporaryLoginPage");
  const me = useMe();
  const userAct = useUserActions();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    val: id,
    setVal: setId,
    isValid: isIdValid,
    errText: idErrText,
    helpText: idHelpText,
  } = useTextForm("", {
    validators: [
      noEmptyValidator(),
      maxLenValidator(16),
    ],
  });
  const isLoginDisabled = isSubmitting || !isIdValid;

  async function handleLoginClick() {
    if (id.length < 4) {
      alert("id too short!");
      return;
    }
    try {
      setIsSubmitting(true);
      const session = await AuthApi.temporaryLogin(id);
      userAct.loadFromSession(session);
      router.replace("/");
      enqueueSnackbar("login success!", { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar("login error..", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (me) {
    return (
      <Center width='100%'>
        <Col alignItems='center'>
          <Gap y={4} />
          <Txt variant='h6'>{t("loggedIn")}</Txt>

          <Gap y={2} />

          <Link href='/'>
            <Button variant='contained'>{t("toHome")}</Button>
          </Link>
        </Col>
      </Center>
    );
  }

  return (
    <Container rtlP>

      <Txt variant='h4'>{t("temporaryLogin")}</Txt>
      <Gap y={2}/>
      <Txt variant='body1'>{t("temporaryLoginDesc")}</Txt>
      <Box
        pt={4}
        maxWidth='400px'
        margin='auto'
        // bgcolor={'green'}
      >
        <Row>
          <TextField
            variant='standard'
            label='ID'
            value={id}
            error={Boolean(idErrText)}
            helperText={idErrText ?? idHelpText ?? null}
            onChange={(e) => setId(e.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
          />
          <Button
            variant="contained"
            disabled={isLoginDisabled}
            onClick={handleLoginClick}
          >
            {isSubmitting ? (
              <LoadingIndicator size="1.5rem"/>
            ) : (
              <span>{t("login")}</span>
            )}
          </Button>
        </Row>
      </Box>
    </Container>
  );
}
