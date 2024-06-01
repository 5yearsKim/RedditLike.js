import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const imageFormZ = {
  host: z.string().nullish(),
  path: z.string(),
  mime_type: z.string().nullish(),
  width: z.number().int().positive().nullish(),
  height: z.number().int().positive().nullish(),
};

export const imageFormSchema = insertFormSchema.extend(imageFormZ);
export const imageSchema = baseModelSchema.extend(imageFormZ);


const tgKey = "Image";

TG.add(tgKey, "ImageFormT", imageFormSchema);
TG.add(tgKey, "ImageT", imageSchema);

