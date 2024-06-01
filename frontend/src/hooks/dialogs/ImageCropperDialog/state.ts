import { atom } from "recoil";

export interface ImageCropperT {
  src: string;
  cropShape?: "rect" | "round";
  aspect?: number;
}

interface ImageCropperStateT extends ImageCropperT {
  isOpen: boolean;
  onCropped?: ({ imgFile }: { imgFile: File; }) => any;
  onDismiss?: () => void;
}

export const imageCropperState = atom<ImageCropperStateT>({
  key: "imageCropper",
  default: {
    src: "",
    isOpen: false,
  },
});
