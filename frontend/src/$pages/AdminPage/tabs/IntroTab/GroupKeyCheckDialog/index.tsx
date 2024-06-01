import React from "react";
import { useTranslations } from "next-intl";
import { Dialog, TextField, Button } from "@mui/material";
import { Row, Box, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { useTextForm } from "@/hooks/TextForm";
import { FRONT_URL_SUFFIX } from "@/config";
import type {} from "@/types";

type GroupKeyCheckDialogProps = {
  open: boolean;
  groupKey: string
  onClose: () => void;
  onUpdate: (groupKey: string) => any;
}

const RESERVED_KEYS = [ "app", "dev", "dev-app", "configure-account" ];

export function GroupKeyCheckDialog({
  open,
  groupKey: initGroupKey,
  onClose,
  onUpdate,
}: GroupKeyCheckDialogProps): JSX.Element {
  const t = useTranslations("pages.AdminPage.IntroTab.GroupKeyCheckDialog");

  const {
    val: key,
    isValid: isKeyValid,
    errText: keyErrText,
    // helpText: keyHelpText,
    setVal: setKey,
  } = useTextForm(initGroupKey, {
    validators: [
      (val) => {
        if (val.length < 3) {
          return t("validateMinLen", { n: 3 });
        }
        if (val.length > 20) {
          return t("validateMaxLen", { n: 20 });
        }
        const regex = /^[A-Za-z0-9$\-_.+!*'(),]+$/;
        if (!regex.test(val)) {
          return t("validateAllowedChars");
        }

        if (val.startsWith("dev-")) {
          return t("validateNotUsable");
        }
        if (RESERVED_KEYS.includes(val)) {
          return t("validateNotUsable");
        }
        return null;
      },
    ],
  });


  return (
    <Dialog open={open} onClose={onClose}>
      <Box px={2} py={1}>

        <Row>
          <TextField
            variant="standard"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            error={!isKeyValid}
            sx={{ maxWidth: 100 }}
          />
          <Txt>.{FRONT_URL_SUFFIX}</Txt>
        </Row>

        {keyErrText && (
          <Txt color='error' variant="body3">{keyErrText}</Txt>
        )}

        <Gap y={2}/>

        <Row justifyContent='flex-end'>
          <Button
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button
            variant='contained'
            onClick={() => onUpdate(key)}
          >
            {t("apply")}
          </Button>
        </Row>
      </Box>
    </Dialog>
  );

}