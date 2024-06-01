import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import {
  flairBoxFormSchema, getFlairBoxOptionSchema, listFlairBoxOptionSchema,
} from "@/models/FlairBox";


// create
const createFlairBoxRqs = z.object({ form: flairBoxFormSchema });
export class CreateFlairBoxDto extends createZodDto(createFlairBoxRqs) {}

// get
const getFlairBoxRqs = getFlairBoxOptionSchema;
export class GetFlairBoxDto extends createZodDto(getFlairBoxRqs) {}

// update
const updateFlairBoxRqs = z.object({ form: flairBoxFormSchema.partial() });
export class UpdateFlairBoxDto extends createZodDto(updateFlairBoxRqs) {}

// delete
// no dto

// list
const listFlairBoxRqs = listFlairBoxOptionSchema;
export class ListFlairBoxDto extends createZodDto(listFlairBoxRqs) {}


