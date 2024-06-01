import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import {
  commentFormSchema, getCommentOptionSchema, listCommentOptionSchema,
} from "@/models/Comment";

// create
const createCommentRqs = z.object({ form: commentFormSchema });
export class CreateCommentDto extends createZodDto(createCommentRqs) {}

// get
const getCommentRqs = getCommentOptionSchema ;
export class GetCommentDto extends createZodDto(getCommentRqs) {}

// update
const updateCommentRqs = z.object({ form: commentFormSchema.partial() });
export class UpdateCommentDto extends createZodDto(updateCommentRqs) {}

// delete
// no dto

// list
const listCommentRqs = listCommentOptionSchema;
export class ListCommentDto extends createZodDto(listCommentRqs) {}

// skim
const skimCommentRqs = listCommentOptionSchema;
export class SkimCommentDto extends createZodDto(skimCommentRqs) {}

// getWithChildren
const getWithChildrenRqs = listCommentOptionSchema;
export class GetWithChildrenDto extends createZodDto(getWithChildrenRqs) {}


// approve
// no dto

// trash
const trashCommentRqs = z.object({ reason: z.string() });
export class TrashCommentDto extends createZodDto(trashCommentRqs) {}


// trashAdmin
const trashAdminCommentRqs = z.object({ reason: z.string() });
export class TrashAdminCommentDto extends createZodDto(trashAdminCommentRqs) {}