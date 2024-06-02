import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import {
  flairBoxFormSchema, getFlairBoxOptionSchema, listFlairBoxOptionSchema,
} from "@/models/FlairBox";


// create
export class CreateFlairBoxDto extends createZodDto(z.object({
  form: flairBoxFormSchema,
})) {}

// get
export class GetFlairBoxDto extends createZodDto(getFlairBoxOptionSchema) {}

// update
export class UpdateFlairBoxDto extends createZodDto(z.object({
  form: flairBoxFormSchema.partial(),
})) {}

// delete
// no dto

// list
export class ListFlairBoxDto extends createZodDto(listFlairBoxOptionSchema) {}


