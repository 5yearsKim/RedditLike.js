import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { flagFormSchema, listFlagOptionSchema } from "@/models/Flag";

// create
export class CreateFlagDto extends createZodDto( z.object({
  form: flagFormSchema,
})) {}

// list
export class ListFlagDto extends createZodDto(listFlagOptionSchema) {}

// update
export class UpdateFlagDto extends createZodDto(z.object({
  form: flagFormSchema.partial(),
})) {}

// delete
// dto not needed