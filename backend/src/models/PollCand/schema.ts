import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const pollCandFormZ = {
  poll_id: z.number().int(),
  label: z.string(),
  thumb_path: z.string().nullish(),
  rank: z.number().int().nullish(),
};

export const pollCandFormSchema = insertFormSchema.extend(pollCandFormZ);

export const pollCandSchema = baseModelSchema.extend(pollCandFormZ);

export const getPollCandOptionSchema = getOptionSchema.extend({
  $num_vote: z.coerce.boolean(),
  $my_vote: z.coerce.boolean(),
}).partial();

export const listPollCandOptionSchema = getPollCandOptionSchema.extend({
  pollId: z.coerce.number().int(),
}).partial();


const tgKey = "PollCand";

TG.add(tgKey, "PollCandFormT", pollCandFormSchema);
TG.add(tgKey, "_PollCandT", pollCandSchema, { private: true });

TG.add(tgKey, "GetPollCandOptionT", getPollCandOptionSchema);
TG.add(tgKey, "ListPollCandOptionT", listPollCandOptionSchema);

