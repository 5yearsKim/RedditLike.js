import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { userFormSchema, listUserOptionSchema , getUserOptionSchema } from "@/models/User";


// create
const createUserRqs = z.object({ form: userFormSchema });
export class CreateUserDto extends createZodDto(createUserRqs) {}

// list
const lisUserRqs = listUserOptionSchema;
export class ListUserDto extends createZodDto(lisUserRqs) {}


// getMe
export class GetMeDto extends createZodDto(getUserOptionSchema) {}

// updateMe
const updateUserMeRqs = z.object({ form: userFormSchema.partial() });
export class UpdateUserMeDto extends createZodDto(updateUserMeRqs) {}

// access
const accessUserRqs = z.object({ groupId: z.number().int() });
export class AccessUserDto extends createZodDto(accessUserRqs) {}

// requestJoin
const requestJoinRqs = z.object({ groupId: z.number().int() });
export class RequestJoinDto extends createZodDto(requestJoinRqs) {}