import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";

const commentVoteFormZ = {
  user_id: z.number().int(),
  comment_id: z.number().int(),
  score: z.number().int(),
};

export const commentVoteFormSchema = insertFormSchema.extend(commentVoteFormZ);

export const commentVoteSchema = baseModelSchema.extend(commentVoteFormZ);


const tgKey = "CommentVote";

TG.add(tgKey, "CommentVoteFormT", commentVoteFormSchema);
export type CommentVoteFormT = z.infer<typeof commentVoteFormSchema>;
TG.add(tgKey, "CommentVoteT", commentVoteSchema);
export type CommentVoteT = z.infer<typeof commentVoteSchema>;
