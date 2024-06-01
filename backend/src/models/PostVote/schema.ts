import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const postVoteFormZ = {
  user_id: z.number().int(),
  post_id: z.number().int(),

  score: z.number().int(),
};

export const postVoteFormSchema = insertFormSchema.extend(postVoteFormZ);
export const postVoteSchema = baseModelSchema.extend(postVoteFormZ);


const tgKey = "PostVote";

TG.add(tgKey, "PostVoteFormT", postVoteFormSchema);
export type PostVoteFormT = z.infer<typeof postVoteFormSchema>;
TG.add(tgKey, "PostVoteT", postVoteSchema);
export type PostVoteT = z.infer<typeof postVoteSchema>;

