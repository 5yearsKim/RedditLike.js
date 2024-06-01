import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const postPinFormZ = {
  board_id: z.number().int().positive(),
  post_id: z.number().int().positive(),

  rank: z.number().int().nullish(),
};

export const postPinFormSchema = insertFormSchema.extend(postPinFormZ);
export const postPinSchema = baseModelSchema.extend(postPinFormZ);


const tgKey = "PostPin";

TG.add(tgKey, "PostPinFormT", postPinFormSchema);
TG.add(tgKey, "PostPinT", postPinSchema);

