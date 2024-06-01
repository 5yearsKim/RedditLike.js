import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { videoFormSchema } from "@/models/Video";


// create
const CreateVideoRqs = z.object({ form: videoFormSchema });
export class CreateVideoDto extends createZodDto(CreateVideoRqs) {}