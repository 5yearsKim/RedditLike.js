import htmlMetaParser from "html-metadata-parser";


interface Image {
  src: string;
}


export interface MetaResult {
  images: Array<Image>;
  meta: {
    description?: string;
    title?: string;
  };
  og: {
    image?: string;
    description?: string;
    title?: string;
    images?: Array<Image>;
    site_name?: string;
    type?: string;
    url?: string;
    videos?: Array<Image>;
  };
}


// const config: AxiosRequestConfig = {
//   headers: {
//     'Accept-Encoding': 'gzip,deflate,br',
//   },
// };


export function checkUrl(url: string): boolean {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
}

export const getMetadata = async (url: string): Promise<MetaResult | null> => {
  try {
    const result = (await htmlMetaParser(url)) as any as MetaResult;
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
