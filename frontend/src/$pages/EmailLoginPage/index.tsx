"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import { Center, Col, Gap, Container } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EmailRequestStep } from "./EmailRequestStep";
import { VerificationStep } from "./VerificationStep";
import { useMe } from "@/stores/UserStore";

export function EmailLoginPage(): JSX.Element {
  const t = useTranslations("pages.EmailLoginPage");
  const me = useMe();
  const [step, setStep] = useState<number>(1); // 1 for init, 2 for verifying
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  function handleEmailRequested(email: string): void {
    setEmail(email);
    setStep(2);
  }

  function handleVerified(): void {
    router.replace("/");
  }

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
      <Box
        pt={4}
        maxWidth='400px'
        margin='auto'
        // bgcolor={'green'}
      >
        {step == 1 && (
          <EmailRequestStep
            onRequested={handleEmailRequested}
          />
        )}
        {step == 2 && (
          <VerificationStep
            email={email}
            onVerified={handleVerified}
          />
        )}
      </Box>
    </Container>
  );
}
