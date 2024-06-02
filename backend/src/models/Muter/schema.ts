import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


export const muterFormSchema = insertFormSchema.extend({
  user_id: z.number().int(),
  until: z.coerce.date().nullable(),
  reason: z.string().max(255).nullable(),
});
export const muterSchema = baseModelSchema.extend(muterFormSchema.shape);

export const getMuterOptionSchema = getOptionSchema.extend({
}).partial();
export const listMuterOptionSchema = getMuterOptionSchema.extend({
  limit: z.coerce.number().int(),
  cursor: z.string(),
  sort: z.enum(["recent", "old"]),
}).partial();


const tgKey = "Muter";

TG.add(tgKey, "MuterFormT", muterFormSchema);
TG.add(tgKey, "MuterT", muterSchema);

TG.add(tgKey, "GetMuterOptionT", getMuterOptionSchema);
TG.add(tgKey, "ListMuterOptionT", listMuterOptionSchema);

