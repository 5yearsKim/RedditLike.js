import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { muterFormSchema, getMuterOptionSchema, listMuterOptionSchema } from "@/models/Muter";


// create
export class CreateGroupMuterDto extends createZodDto(z.object({
  form: muterFormSchema,
})) {}

// list
export class ListGroupMuterDto extends createZodDto(listMuterOptionSchema) {}

// delete
// no dto

// getMe
// no dto
