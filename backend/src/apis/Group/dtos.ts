import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { groupFormSchema, getGroupOptionSchema, listGroupOptionSchema } from "@/models/Group";

// create
export class CreateGroupDto extends createZodDto(z.object({
  form: groupFormSchema,
})) {}

// get
export class GetGroupDto extends createZodDto(getGroupOptionSchema) {}

// getByKey
export class GetByKeyGroupDto extends createZodDto(getGroupOptionSchema) {}

// list
export class ListGroupDto extends createZodDto(listGroupOptionSchema) {}

// update
export class UpdateGroupDto extends createZodDto(z.object({
  form: groupFormSchema.partial()
})) {}

// getAvatarPresigenedUrl
export class GetAvatarPresignedUrlDto extends createZodDto(z.object({
  groupId: z.number().int(),
  mimeType: z.string(),
})) {}