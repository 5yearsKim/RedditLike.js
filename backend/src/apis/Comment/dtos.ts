import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import {
  commentFormSchema, getCommentOptionSchema, listCommentOptionSchema,
} from "@/models/Comment";

// create
export class CreateCommentDto extends createZodDto(z.object({ form: commentFormSchema })) {}

// get
export class GetCommentDto extends createZodDto(getCommentOptionSchema) {}

// update
export class UpdateCommentDto extends createZodDto( z.object({
  form: commentFormSchema.partial(),
})) {}

// delete
// no dto

// list
export class ListCommentDto extends createZodDto(listCommentOptionSchema) {}

// skim
export class SkimCommentDto extends createZodDto(listCommentOptionSchema) {}

// getWithChildren
export class GetWithChildrenDto extends createZodDto(listCommentOptionSchema) {}


// approve
// no dto

// trash
export class TrashCommentDto extends createZodDto(z.object({ reason: z.string() })) {}


// trashAdmin
export class TrashAdminCommentDto extends createZodDto( z.object({ reason: z.string() })) {}