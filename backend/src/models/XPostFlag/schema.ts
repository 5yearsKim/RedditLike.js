import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const xPostFlagFormZ = {
  flag_id: z.number().int(),
  post_id: z.number().int(),
  rank: z.number().int().nullish()
};

export const xPostFlagFormSchema = insertFormSchema.extend(xPostFlagFormZ);

export const xPostFlagSchema = baseModelSchema.extend(xPostFlagFormZ);


const tgKey = "XPostFlag";

TG.add(tgKey, "XPostFlagFormT", xPostFlagFormSchema);
export type XPostFlagFormT = z.infer<typeof xPostFlagFormSchema>

TG.add(tgKey, "XPostFlagT", xPostFlagSchema);
export type XPostFlagT = z.infer<typeof xPostFlagSchema>

