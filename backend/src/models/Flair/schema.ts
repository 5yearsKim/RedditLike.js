import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const flairFormZ = {
  box_id: z.number().int(),
  label: z.string().max(32),
  text_color: z.string().max(7).nullish(),
  bg_color: z.string().max(7).nullish(),
  rank: z.number().int().nullish(),

  creator_id: z.number().int().nullish(),
  manager_only: z.boolean().optional(),
};

export const flairFormSchema = insertFormSchema.extend(flairFormZ);

export const flairSchema = baseModelSchema.extend(flairFormZ);

export const getFlairOptionSchema = getOptionSchema.extend({});
export const listFlairOptionSchema = getFlairOptionSchema.extend({});


const tgKey = "Flair";

TG.add(tgKey, "FlairFormT", flairFormSchema);
TG.add(tgKey, "FlairT", flairSchema);

TG.add(tgKey, "GetFlairOptionT", getFlairOptionSchema);
TG.add(tgKey, "ListFlairOptionT", listFlairOptionSchema);


