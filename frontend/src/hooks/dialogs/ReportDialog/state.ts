import { atom } from "recoil";

interface ReportDialogStateT {
  type: "comment" | "post";
  targetId: idT;
  isOpen: boolean;
}

export const reportDialogState = atom<ReportDialogStateT>({
  key: "reportDialog",
  default: {
    type: "post",
    targetId: -1,
    isOpen: false,
  },
});
