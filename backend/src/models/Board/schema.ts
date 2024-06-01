import { z } from "zod";
import {
  baseModelSchema, insertFormSchema, getOptionSchema, censorFilterEnum,
} from "../$commons/schema";
import { TG } from "@/utils/type_generator";


// sort enum
export const boardSortEnum = z.enum([ "hot", "recent", "old", "follower", "recently_followed"]);


// board
const boardFormZ = {
  group_id: z.number().int(),
  name: z.string().min(1).max(32),
  description: z.string().min(1),
  avatar_path: z.string().nullish(),
  bg_path: z.string().nullish(),

  theme_color: z.string().nullish(),

  default_nickname: z.string().nullish(),
  default_avatar_path: z.string().nullish(),

  trashed_at: z.coerce.date().nullish(),
  trashed_by: z.enum(["manager", "admin"]).nullish(),

  // aggrs
  hot_score: z.number().optional(),
  num_follower: z.number().int().optional(),
  num_post: z.number().int().optional(),

  // optional
  use_theme: z.boolean().optional(),
  use_spoiler: z.boolean().optional(),
  use_nsfw: z.boolean().optional(),
  use_flag: z.boolean().optional(),
  force_flag: z.boolean().optional(),
  allow_multiple_flag: z.boolean().optional(),

  use_flair: z.boolean().optional(),
  force_flair: z.boolean().optional(),
  allow_post_manager_only: z.boolean().optional(),
  use_public_chat: z.boolean().optional(),
  use_email_only: z.boolean().optional(),
};

export const boardFormSchema = insertFormSchema.extend(boardFormZ);

export const boardSchema = baseModelSchema.extend({
  ...boardFormZ,
  // aggrs
  hot_score: z.number().int(),
  num_follower: z.number().int(),
  num_post: z.number().int(),
  // optional with default
  use_theme: z.boolean(),
  use_spoiler: z.boolean(),
  use_nsfw: z.boolean(),
  use_flag: z.boolean(),
  force_flag: z.boolean(),
  allow_multiple_flag: z.boolean(),

  use_flair: z.boolean(),
  force_flair: z.boolean(),
  allow_post_manager_only: z.boolean(),
  use_public_chat: z.boolean(),
  use_email_only: z.boolean(),
});


export const getBoardOptionSchema = getOptionSchema.extend({
  $user_defaults: z.coerce.boolean(),
  $posts: z.enum(["recent"]),
}).partial();

export const listBoardOptionSchema = getBoardOptionSchema.extend({
  sort: boardSortEnum,
  cursor: z.string(),
  limit: z.coerce.number().int().positive(),
  following: z.enum(["only", "except"]),
  managing: z.enum(["only", "except"]),
  block: z.enum(["only", "except"]),
  censor: censorFilterEnum,
  search: z.string(),
  categoryId: z.coerce.number().int().positive().or(z.literal("except")).or(z.array(z.number().int().positive())),
}).partial();


const tgKey = "Board";

TG.add(tgKey, "BoardFormT", boardFormSchema);
TG.add(tgKey, "_BoardT", boardSchema, { private: true });

TG.add(tgKey, "GetBoardOptionT", getBoardOptionSchema);
TG.add(tgKey, "ListBoardOptionT", listBoardOptionSchema);

TG.add(tgKey, "BoardSortT", boardSortEnum);
