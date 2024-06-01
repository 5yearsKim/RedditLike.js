import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@mui/material";
import { ErrorIcon } from "@/ui/icons";

type ErrorButtonProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorButton({
  message,
  onRetry,
}: ErrorButtonProps): JSX.Element {
  const t = useTranslations("components.$statusTools");

  return (
    <Button
      onClick={onRetry}
      startIcon={<ErrorIcon />}
    >
      {message ?? t("retry")}
    </Button>
  );
}
