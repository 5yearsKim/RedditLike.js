import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const xPostImageFormZ = {
  post_id: z.number().int(),
  image_id: z.number().int(),
  rank: z.number().int().nullish(),
};

export const xPostImageFormSchema = insertFormSchema.extend(xPostImageFormZ);

export const xPostImageSchema = baseModelSchema.extend(xPostImageFormZ);


const tgKey = "XPostImage";

TG.add(tgKey, "XPostImageFormT", xPostImageFormSchema);
TG.add(tgKey, "XPostImageT", xPostImageSchema);

