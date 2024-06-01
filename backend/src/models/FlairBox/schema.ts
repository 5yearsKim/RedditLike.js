import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const flairBoxFormZ = {
  board_id: z.number().int(),

  name: z.string(),
  description: z.string().nullish(),
  // optional
  is_editable: z.boolean().optional(),
  is_multiple: z.boolean().optional(),
  is_force: z.boolean().optional(),
};

export const flairBoxFormSchema = insertFormSchema.extend(flairBoxFormZ);

export const flairBoxSchema = baseModelSchema.extend({
  ...flairBoxFormZ,
  // optional with default
  is_editable: z.boolean(),
  is_multiple: z.boolean(),
  is_force: z.boolean(),
});

export const getFlairBoxOptionSchema = getOptionSchema.extend({
  $flairs: z.coerce.boolean(),
  $custom_flairs: z.coerce.boolean(),
}).partial();
export const listFlairBoxOptionSchema = getFlairBoxOptionSchema.extend({
  boardId: z.coerce.number().int(),
}).partial();


const tgKey = "FlairBox";

TG.add(tgKey, "FlairBoxFormT", flairBoxFormSchema);
TG.add(tgKey, "_FlairBoxT", flairBoxSchema, { private: true });

TG.add(tgKey, "GetFlairBoxOptionT", getFlairBoxOptionSchema);
TG.add(tgKey, "ListFlairBoxOptionT", listFlairBoxOptionSchema);

