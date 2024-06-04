import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { userFormSchema, listUserOptionSchema , getUserOptionSchema } from "@/models/User";


// create
export class CreateUserDto extends createZodDto(z.object({
  form: userFormSchema,
})) {}

// list
export class ListUserDto extends createZodDto(listUserOptionSchema) {}


// getMe
export class GetMeDto extends createZodDto(getUserOptionSchema) {}

// updateMe
export class UpdateUserMeDto extends createZodDto(z.object({
  form: userFormSchema.partial(),
})) {}

// access
export class AccessUserDto extends createZodDto( z.object({
  token: z.string(),
})) {}
