import axios from "axios";
import { RESOURCE_URL } from "@/config";

// export async function uploadImageFromFile(
//   file: File,
//   onProgress: ((amount: number) => void) | undefined = undefined,
// ): Promise<ImageT> {
//   const { width, height } = await getImageSize(URL.createObjectURL(file));

//   const { putUrl, getUrl } = await getUploadUrl(file.type);

//   await uploadToS3(putUrl, file, onProgress);

//   const form: MImageFormT = {
//     url: getUrl,
//     mime_type: file.type,
//     width: width,
//     height: height,
//   };

//   const image = await ImageS.create(form);

//   return image;
// }

export { getImageSize } from "react-image-size";


export async function convertFileInArray<DataT>(
  data: (DataT | File)[],
  convertFile: (file: File) => Promise<DataT>,
): Promise<DataT[]> {
  const idxFileMap: { [idx: number]: File } = {};
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item instanceof File) {
      idxFileMap[i] = item;
    }
  }
  if (!Object.keys(idxFileMap).length) {
    return data as DataT[];
  }
  const uploadPromises = Object.entries(idxFileMap).map(async ([idx, file]): Promise<[number, DataT]> => {
    const newData = await convertFile(file);
    return [parseInt(idx), newData];
  });
  const uploaded = await Promise.all(uploadPromises);

  const newData = [...data];
  for (const [idx, uploadedData] of uploaded) {
    newData[idx] = uploadedData;
  }

  return newData as DataT[];
}

export function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}


export async function uploadToS3(
  presignedUrl: string,
  file: File,
  onProgress?: (amount: number) => void,
): Promise<void> {
  await axios.put(presignedUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: onProgress ? (e): void => onProgress(e.loaded / (e.total ?? 1)) : undefined,
  });
}

// export async function uploadBase64ToS3(
//   presignedUrl: string,
//   contentType: string,
//   base64: string,
//   onProgress?: (amount: number) => void,
// ): Promise<void> {
//   const dfile = dataURLtoFile(base64, "tmp");
//   await axios.put(presignedUrl, dfile, {
//     headers: { "Content-Type": contentType },
//     onUploadProgress: onProgress ? (e): void => onProgress(e.loaded / (e.total ?? 1)) : undefined,
//   });
// }

type ImageSizeT = "xxs"| "xs" | "sm" | "md" | "lg";


export function buildImgUrl(
  host: string|null,
  path: string,
  option: {size?: ImageSizeT} = {},
): string {
  if (host !== null) {
    return new URL(path, host).toString();
  }
  let url = new URL(path, RESOURCE_URL).toString();
  if (option.size) {
    url = `${url}?w=${getResizeW(option.size)}`;
  }
  return url;
}


function getResizeW(size: ImageSizeT): number{
  switch (size) {
  case "xxs":
    return 90;
  case "xs":
    return 180;
  case "sm":
    return 360;
  case "md":
    return 720;
  case "lg":
    return 1440;
  default:
    return 720;
  }
}
