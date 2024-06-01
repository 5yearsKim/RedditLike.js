"use client";

import { useRecoilState } from "recoil";
import { reportDialogState } from "./state";

export function useReportDialog(type: "comment" | "post") {
  const [reportDialog, setReportDialog] = useRecoilState(reportDialogState);

  function showReportDialog(targetId: idT): void {
    setReportDialog({
      type,
      targetId,
      isOpen: true,
    });
  }

  function closeReportDialog(): void {
    setReportDialog({
      ...reportDialog,
      isOpen: false,
    });
  }

  return {
    showReportDialog,
    closeReportDialog,
  };
}
