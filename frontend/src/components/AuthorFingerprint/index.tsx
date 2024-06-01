import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Row } from "@/ui/layouts";
import { ManagerIcon } from "@/ui/icons";
import { red, blue } from "@mui/material/colors";
import { Tooltip } from "@/ui/tools/Tooltip";
import { InfoTxt } from "./style";

export type AuthorFingerprintProps = {
  isMe?: boolean;
  isAuthor?: boolean;
  authorIdx?: number;
  isManager?: boolean;
};

export function AuthorFingerprint({
  isMe,
  isAuthor,
  authorIdx,
  isManager,
}: AuthorFingerprintProps): JSX.Element {
  const t = useTranslations("components.AuthorFingerprint");

  const nodes: JSX.Element[] = [];
  const fontSize = 10;
  if (isMe) {
    nodes.push(
      <InfoTxt
        key='me'
        color={blue[500]}
        fontWeight={700}
      >
        {t("me")}
      </InfoTxt>,
    );
  }

  if (isAuthor) {
    nodes.push(
      <InfoTxt
        key='author'
        color={red[600]}
      >
        {t("author")}
      </InfoTxt>,
    );
  }
  if (nodes.length == 0 && authorIdx !== undefined) {
    nodes.push(
      <InfoTxt
        key='author_idx'
        color='vague.main'
      >
        #{authorIdx + 1}
      </InfoTxt>,
    );
  }
  if (isManager) {
    nodes.push(
      <Fragment key='manager'>
        <Tooltip title={t("boardManager")}>
          <ManagerIcon
            color='primary'
            sx={{ fontSize: fontSize + 6 }}
          />
        </Tooltip>
      </Fragment>,
    );
  }

  return (
    <Row
      height='1.1rem'
      columnGap={0.4}
      alignItems='start'
      ml={0.5}
      sx={{ userSelect: "none" }}
    >
      {nodes}
    </Row>
  );
}
