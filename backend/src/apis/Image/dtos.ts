import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { imageFormSchema } from "@/models/Image";


// create
const CreateImageRqs = z.object({ form: imageFormSchema });
export class CreateImageDto extends createZodDto(CreateImageRqs) {}

