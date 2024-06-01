import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardBlockFormSchema } from "@/models/BoardBlock";

// create
const CreateRqs = z.object({ form: boardBlockFormSchema });
export class CreateDto extends createZodDto(CreateRqs) {}

// delete
// no dto