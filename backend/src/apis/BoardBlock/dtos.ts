import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardBlockFormSchema } from "@/models/BoardBlock";

// create
export class CreateDto extends createZodDto(z.object({
  form: boardBlockFormSchema,
})) {}

// delete
// no dto