import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { xPostFlagFormSchema } from "@/models/XPostFlag";

// create
export class CreateXPostFlagDto extends createZodDto(z.object({
  form: xPostFlagFormSchema,
})) {}
