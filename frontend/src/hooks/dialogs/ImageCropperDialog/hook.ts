"use client";

import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { ImageCropperT, imageCropperState } from "./state";

export function useImageCropper() {
  const setImageCropper = useSetRecoilState(imageCropperState);

  const showImageCropper = useCallback((options: ImageCropperT): Promise<null | { imgFile: File }> => {
    return new Promise((res) => {
      setImageCropper({
        ...options,
        isOpen: true,
        onCropped: (result) => res(result),
        onDismiss: () => res(null),
      });
    });
  }, []);

  return { showImageCropper };
}
