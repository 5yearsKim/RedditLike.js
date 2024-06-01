import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const postCheckFormZ = {
  post_id: z.number().int(),
  user_id: z.number().int().nullish(),
  ip_addr: z.string().nullish(),
  is_dummy: z.boolean().nullish(),
};

export const postCheckFormSchema = insertFormSchema.extend(postCheckFormZ);
export const postCheckSchema = baseModelSchema.extend(postCheckFormZ);


const tgKey = "PostCheck";

TG.add(tgKey, "PostCheckFormT", postCheckFormSchema);
TG.add(tgKey, "PostCheckT", postCheckSchema);

