import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const pollFormZ = {
  author_id: z.number().int(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  allow_multiple: z.boolean().optional(),
  expires_at: z.coerce.date().nullish(),
};

export const pollFormSchema = insertFormSchema.extend(pollFormZ);

export const pollSchema = baseModelSchema.extend({
  ...pollFormZ,
  // optional with default
  allow_multiple: z.boolean(),
});

export const getPollOptionSchema = getOptionSchema.extend({
  $cands: z.coerce.boolean(),
}).partial();
export const listPollOptionSchema = getPollOptionSchema.extend({});


const tgKey = "Poll";

TG.add(tgKey, "PollFormT", pollFormSchema);
TG.add(tgKey, "_PollT", pollSchema, { private: true });

TG.add(tgKey, "GetPollOptionT", getPollOptionSchema);
TG.add(tgKey, "ListPollOptionT", listPollOptionSchema);

