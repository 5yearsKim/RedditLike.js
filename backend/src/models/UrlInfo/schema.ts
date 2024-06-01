import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


// url: string
// title: string|null
// description: string|null
// image: string|null
// sitename: string|null
// hostname: string|null
const urlInfoFormZ = {
  url: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  sitename: z.string().nullable(),
  hostname: z.string().nullable(),
};

export const urlInfoFormSchema = insertFormSchema.extend(urlInfoFormZ);

export const urlInfoSchema = baseModelSchema.extend(urlInfoFormZ);


const tgKey = "UrlInfo";

TG.add(tgKey, "UrlInfoFormT", urlInfoFormSchema);
TG.add(tgKey, "UrlInfoT", urlInfoSchema);


