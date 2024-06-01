import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const pollVoteFormZ = {
  user_id: z.number().int(),
  cand_id: z.number().int(),
};

export const pollVoteFormSchema = insertFormSchema.extend(pollVoteFormZ);

export const pollVoteSchema = baseModelSchema.extend(pollVoteFormZ);

export const getPollVoteOptionSchema = getOptionSchema.extend({});
export const listPollVoteOptionSchema = getPollVoteOptionSchema.extend({});


const tgKey = "PollVote";

TG.add(tgKey, "PollVoteFormT", pollVoteFormSchema);
TG.add(tgKey, "PollVoteT", pollVoteSchema);

TG.add(tgKey, "GetPollVoteOptionT", getPollVoteOptionSchema);
TG.add(tgKey, "ListPollVoteOptionT", listPollVoteOptionSchema);

