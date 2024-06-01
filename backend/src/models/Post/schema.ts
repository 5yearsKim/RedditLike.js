import { z } from "zod";
import {
  baseModelSchema, insertFormSchema, getOptionSchema,
  censorFilterEnum, reportFilterEnum,
} from "../$commons/schema";
import { TG } from "@/utils/type_generator";

export const postSortEnum = z.enum(["recent", "hot", "vote", "discussed" ]);

const postFormZ = {
  author_id: z.number().int().nullable(), // nullable for deleted users
  board_id: z.number().int(),
  title: z.string().max(255),
  body: z.string().nullish(),
  body_type: z.enum(["md", "html"]),

  is_nsfw: z.boolean().optional(),
  is_spoiler: z.boolean().optional(),
  ignore_report: z.boolean().optional(),

  published_at: z.coerce.date().nullish(),
  rewrite_at: z.coerce.date().nullish(),
  deleted_at: z.coerce.date().nullish(),

  trashed_at: z.coerce.date().nullish(),
  trashed_by: z.enum(["manager", "admin"]).nullish(),
  approved_at: z.coerce.date().nullish(),
  reserved_at: z.coerce.date().nullish(),
  show_manager: z.boolean().optional(),

  content_source: z.string().nullish(),
  thumb_path: z.string().nullish(),

  // aggrs
  hot_score: z.number().optional(),
  num_vote: z.number().int().optional(),
  score: z.number().int().optional(),
  num_comment: z.number().int().optional(),
};

export const postFormSchema = insertFormSchema.extend(postFormZ);

export const postSchema = baseModelSchema.extend({
  ...postFormZ,
  // optional with default
  is_nsfw: z.boolean(),
  is_spoiler: z.boolean(),
  ignore_report: z.boolean(),
  show_manager: z.boolean(),
  // aggrs
  hot_score: z.number().int(),
  num_vote: z.number().int(),
  score: z.number().int(),
  num_comment: z.number().int(),
});

export const getPostOptionSchema = getOptionSchema.extend({
  $defaults: z.coerce.boolean(),
  $user_defaults: z.coerce.boolean(),
  $manager_defaults: z.coerce.boolean(),
  $board: z.coerce.boolean(),
  $pin: z.coerce.boolean(),
}).partial();

export const listPostOptionSchema = getPostOptionSchema.extend({
  sort: postSortEnum,
  limit: z.coerce.number().int(),
  cursor: z.string(),
  boardId: z.coerce.number().int(),
  authorId: z.coerce.number().int(),
  search: z.string(),
  pin: z.enum(["only", "except"]),
  following: z.enum(["only", "except"]),
  block: z.enum(["only", "except"]),
  bookmark: z.enum(["only", "except"]),
  published: z.enum(["only", "except"]), // default to 'only'
  censor: censorFilterEnum,
  boardCensor: z.enum(["trashed", "exceptTrashed", "all"]), // default to 'exceptTrashed'
  flagId: z.coerce.number().int(),
  report: reportFilterEnum,
  fromAt: z.coerce.date(),
}).partial();

const tgKey = "Post";

TG.add(tgKey, "PostFormT", postFormSchema);
TG.add(tgKey, "_PostT", postSchema, { private: true });

TG.add(tgKey, "PostSortT", postSortEnum);
TG.add(tgKey, "GetPostOptionT", getPostOptionSchema);
TG.add(tgKey, "ListPostOptionT", listPostOptionSchema);
