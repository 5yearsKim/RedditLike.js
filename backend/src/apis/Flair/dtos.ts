import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { flairFormSchema } from "@/models/Flair";

// create
export class CreateFlairDto extends createZodDto(z.object({
  form: flairFormSchema,
})) {}

// update
export class UpdateFlairDto extends createZodDto( z.object({
  form: flairFormSchema.partial(),
})) {}

// delete
// no dto


// rerank
export class RerankFlairDto extends createZodDto( z.object({
  boxId: z.number().int(),
  flairIds: z.array(z.number().int()),
})) {}

// create custom
export class CreateCustomFlairDto extends createZodDto( z.object({
  form: flairFormSchema,
})) {}

// delete custom
// no dto