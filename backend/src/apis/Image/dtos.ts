import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { imageFormSchema } from "@/models/Image";


// create
export class CreateImageDto extends createZodDto(z.object({ form: imageFormSchema })) {}

