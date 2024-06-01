import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const postBookmarkFormZ = {
  user_id: z.number().int(),
  post_id: z.number().int(),
};

export const postBookmarkFormSchema = insertFormSchema.extend(postBookmarkFormZ);

export const postBookmarkSchema = baseModelSchema.extend(postBookmarkFormZ);

export const getPostBookmarkOptionSchema = getOptionSchema.extend({});
export const listPostBookmarkOptionSchema = getPostBookmarkOptionSchema.extend({});


const tgKey = "PostBookmark";

TG.add(tgKey, "PostBookmarkFormT", postBookmarkFormSchema);
TG.add(tgKey, "PostBookmarkT", postBookmarkSchema);

TG.add(tgKey, "GetPostBookmarkOptionT", getPostBookmarkOptionSchema);
TG.add(tgKey, "ListPostBookmarkOptionT", listPostBookmarkOptionSchema);

