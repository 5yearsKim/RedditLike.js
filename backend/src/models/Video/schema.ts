import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const videoFormZ = {
  host: z.string().nullish(),
  path: z.string(),
  s_path: z.string().nullish(),
  thumb_path: z.string().nullish(),
  converted_at: z.coerce.date().nullish(),
  mime_type: z.string().nullish(),
};

export const videoFormSchema = insertFormSchema.extend(videoFormZ);
export const videoSchema = baseModelSchema.extend(videoFormZ);


const tgKey = "Video";

TG.add(tgKey, "VideoFormT", videoFormSchema);
TG.add(tgKey, "VideoT", videoSchema);

