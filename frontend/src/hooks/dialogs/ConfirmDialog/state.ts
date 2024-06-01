import { ReactNode } from "react";
import { atom } from "recoil";

export interface ConfirmDialogT {
  main?: ReactNode;
  useOk?: boolean;
  useCancel?: boolean;
  dismissible?: boolean;
  themeDisabled?: boolean;
}

interface ConfirmDialogStateT extends ConfirmDialogT {
  isOpen: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

export const confirmDialogState = atom<ConfirmDialogStateT>({
  key: "confirmDialog",
  default: {
    isOpen: false,
    main: undefined,
    useOk: true,
    useCancel: true,
    dismissible: true,
    themeDisabled: undefined,
  },
});
