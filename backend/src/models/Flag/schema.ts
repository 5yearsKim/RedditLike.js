import { z } from "zod";
import { baseModelSchema, getOptionSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const flagFormZ = {
  board_id: z.number().int(),
  label: z.string().min(1).max(32),
  text_color: z.string().nullish(),
  bg_color: z.string().nullish(),
  description: z.string().nullish(),
  manager_only: z.boolean().optional(),
};

export const flagFormSchema = insertFormSchema.extend(flagFormZ);

export const flagSchema = baseModelSchema.extend({
  ...flagFormZ,
  // optional with default
  manager_only: z.boolean()
});

export const getFlagOptionSchema = getOptionSchema.extend({});
export const listFlagOptionSchema = getFlagOptionSchema.extend({
  boardId: z.coerce.number().int()
}).partial();


const tgKey = "Flag";

TG.add(tgKey, "FlagFormT", flagFormSchema);
TG.add(tgKey, "FlagT", flagSchema);

TG.add(tgKey, "GetFlagOptionT", getFlagOptionSchema);
TG.add(tgKey, "ListFlagOptionT", listFlagOptionSchema);


