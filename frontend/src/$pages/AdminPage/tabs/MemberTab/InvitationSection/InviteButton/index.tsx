"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AddIcon } from "@/ui/icons";
import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Button, Dialog, TextField, CircularProgress } from "@mui/material";
import { useTextForm } from "@/hooks/TextForm";
import { emailValidator } from "@/utils/validator";
import { useGroup } from "@/stores/GroupStore";
import { useSnackbar } from "@/hooks/Snackbar";
import * as GroupInvitationApi from "@/apis/group_invitations";
import type { InviteStatusT, GroupInvitationT } from "@/types";

type InviteButtonProps = {
  onInvited: (status: InviteStatusT, invitation: GroupInvitationT|null) => void
}

export function InviteButton({ onInvited }: InviteButtonProps): JSX.Element {
  const t = useTranslations("pages.AdminPage.MemberTab.InvitationSection.InviteButton");
  const group = useGroup();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    val: email,
    setVal: setEmail,
    isValid: isEmailValid,
    errText: emailErrText,
  } = useTextForm("", {
    validators: [emailValidator()],
  });
  const { enqueueSnackbar } = useSnackbar();
  const submitDisabled = !isEmailValid || isSubmitting;

  useEffect(() => {
    if (!dialogOpen) {
      // reset
      setEmail("");
    }
  }, [dialogOpen]);


  function handleInviteClick(): void {
    setDialogOpen(true);
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>): void {
    setEmail(e.target.value);
  }

  function handleCancelClick(): void {
    setDialogOpen(false);
  }

  async function handleInviteSubmit(): Promise<void> {
    try {
      setIsSubmitting(true);
      const { status: invitationStatus, invitation } = await GroupInvitationApi.invite(group.id, email);

      switch (invitationStatus) {
      case "alreadyMember":
        enqueueSnackbar(t("alreadyRegistered"), { variant: "info" });
        break;
      case "declined":
        enqueueSnackbar(t("alreadyDeclined"), { variant: "info" });
        break;
      default:
        enqueueSnackbar(t("inviteSuccess"), { variant: "success" });
        break;
      }
      onInvited(invitationStatus, invitation);
      setDialogOpen(false);
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("inviteFailed"), { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant='contained'
        onClick={handleInviteClick}
      >
        {t("invite")}
      </Button>
      <Dialog open={dialogOpen}>
        <Col px={2} py={2} minWidth={300}>
          <Txt variant='h6'>{t("groupInvitation")}</Txt>

          <Gap y={2}/>

          <TextField
            label={t("email")}
            value={email}
            error={email.length > 0 && Boolean(emailErrText)}
            helperText={email.length > 0 && emailErrText}
            type="email"
            onChange={handleEmailChange}
            placeholder="email@example.com"
          />

          <Gap y={2}/>

          <Row justifyContent='flex-end'>
            <Button onClick={handleCancelClick}>
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              disabled={submitDisabled}
              onClick={handleInviteSubmit}
            >
              {isSubmitting ? <CircularProgress size='1.5rem'/> : t("apply") }
            </Button>
          </Row>
        </Col>
      </Dialog>
    </>
  );
}