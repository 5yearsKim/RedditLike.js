import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { videoFormSchema } from "@/models/Video";


// create
export class CreateVideoDto extends createZodDto(z.object({
  form: videoFormSchema,
})) {}