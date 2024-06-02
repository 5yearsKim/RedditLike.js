import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { adminFormSchema, listAdminOptionSchema } from "@/models/Admin";


// create
export class CreateAdminDto extends createZodDto(z.object({
  form: adminFormSchema,
})) {}

// list
export class ListAdminDto extends createZodDto(listAdminOptionSchema) {}

// update
export class UpdateAdminDto extends createZodDto(z.object({
  form: adminFormSchema.partial(),
})) {}

// delete
// no dto

// createByEmail
export class CreateAdminByEmailDto extends createZodDto(z.object({
  email: z.string().email(),
})) {}
