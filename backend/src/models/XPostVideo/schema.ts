import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const xPostVideoFormZ = {
  post_id: z.number().int(),
  video_id: z.number().int(),
  rank: z.number().int().nullish(),
};

export const xPostVideoFormSchema = insertFormSchema.extend(xPostVideoFormZ);
export const xPostVideoSchema = baseModelSchema.extend(xPostVideoFormZ);


const tgKey = "XPostVideo";

TG.add(tgKey, "XPostVideoFormT", xPostVideoFormSchema);
TG.add(tgKey, "XPostVideoT", xPostVideoSchema);

