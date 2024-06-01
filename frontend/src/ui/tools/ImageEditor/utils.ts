import { dataURLtoFile, uploadToS3 } from "@/utils/media";
import * as ImageApi from "@/apis/images";
import * as PostApi from "@/apis/posts";
import type { ImageT, ImageFormT } from "@/types/Image";

export type savedImageData = {
  name: string;
  extension: string;
  mimeType: string;
  fullName?: string;
  height?: number;
  width?: number;
  imageBase64?: string;
  imageCanvas?: HTMLCanvasElement; // doesn't support quality
  quality?: number;
  cloudimageUrl?: string;
};

export async function uploadImageFromSavedImage(saved: savedImageData): Promise<ImageT> {
  if (!saved.imageBase64) {
    throw Error("base64 string is empty");
  }
  let mimeType = saved.mimeType;
  if (mimeType == "image/jpg") {
    mimeType = "image/jpeg";
  }
  const { putUrl, key } = await PostApi.getImagePresignedUrl(saved.mimeType);

  // const base64Data = saved.imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const base64Data = saved.imageBase64;

  const dfile = dataURLtoFile(base64Data, "tmp");
  await uploadToS3(putUrl, dfile);

  const imageForm: ImageFormT = {
    path: key,
    mime_type: mimeType,
    width: saved.width,
    height: saved.height,
  };
  const newImage = await ImageApi.create(imageForm);

  return newImage;
}
