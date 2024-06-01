import { z } from "zod";
import {
  baseModelSchema, insertFormSchema, getOptionSchema,
  censorFilterEnum, reportFilterEnum,
} from "../$commons/schema";
import { TG } from "@/utils/type_generator";

const commentSortEnum = z.enum(["old", "recent", "vote", "discussed" ]);

const commentFormZ = {
  author_id: z.number().int().nullable(), // null for deleted users
  post_id: z.number().int(),

  body: z.string().nullish(),
  body_type: z.enum(["html", "md"]),
  path: z.string().nullish(),
  parent_id: z.number().int().nullish(),

  ignore_report: z.boolean().optional(),

  published_at: z.coerce.date().nullish(),
  rewrite_at: z.coerce.date().nullish(),
  deleted_at: z.coerce.date().nullish(),

  trashed_at: z.coerce.date().nullish(),
  trashed_by: z.enum(["manager", "admin"]).nullish(),
  approved_at: z.coerce.date().nullish(),

  show_manager: z.coerce.boolean().optional(),

  // aggrs
  num_vote: z.number().int().optional(),
  score: z.number().int().optional(),
  num_children: z.number().int().optional(),
};

export const commentFormSchema = insertFormSchema.extend(commentFormZ);
export const commentSchema = baseModelSchema.extend({
  ...commentFormZ,
  // optional with default
  ignore_report: z.boolean(),
  // aggrs
  num_vote: z.number().int(),
  score: z.number().int(),
  num_children: z.number().int(),
});

export const getCommentOptionSchema = getOptionSchema.extend({
  $defaults: z.coerce.boolean(),
  $user_defaults: z.coerce.boolean(),
  $manager_defaults: z.coerce.boolean(),
  $parent: z.coerce.boolean(),
  $post: z.coerce.boolean(),
  $author_idx: z.coerce.boolean(),
}).partial();

export const listCommentOptionSchema = getCommentOptionSchema.extend({
  cursor: z.string(),
  limit: z.coerce.number().int(),
  sort: commentSortEnum,
  search: z.string(),
  postId: z.coerce.number().int(),
  boardId: z.coerce.number().int(), // only when lookup post
  authorId: z.coerce.number().int(),
  rootPath: z.string().nullable(), // Ltree for path or null
  // commentId: z.coerce.number().int(), // fetch only one comment
  report: reportFilterEnum,
  censor: censorFilterEnum,
}).partial();


const tgKey = "Comment";

TG.add(tgKey, "CommentSortT", commentSortEnum);
TG.add(tgKey, "CommentFormT", commentFormSchema);
TG.add(tgKey, "_CommentT", commentSchema, { private: true });

TG.add(tgKey, "GetCommentOptionT", getCommentOptionSchema);
TG.add(tgKey, "ListCommentOptionT", listCommentOptionSchema);
