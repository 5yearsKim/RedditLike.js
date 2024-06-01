import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { groupAdminFormSchema, listGroupAdminOptionSchema } from "@/models/GroupAdmin";


// create
const createGroupAdminRqs = z.object({ form: groupAdminFormSchema });
export class CreateGroupAdminDto extends createZodDto(createGroupAdminRqs) {}

// list
const listGroupAdminRqs = listGroupAdminOptionSchema;
export class ListGroupAdminDto extends createZodDto(listGroupAdminRqs) {}

// update
const updateGroupAdminRqs = z.object({ form: groupAdminFormSchema.partial() });
export class UpdateGroupAdminDto extends createZodDto(updateGroupAdminRqs) {}

// delete
// no dto

// createByEmail
const createGroupAdminByEmailRqs = z.object({ groupId: z.number().int(), email: z.string().email() });
export class CreateGroupAdminByEmailDto extends createZodDto(createGroupAdminByEmailRqs) {}

// getMe
const getMeGroupAdminRqs = z.object({ groupId: z.coerce.number().int() });
export class GetMeGroupAdminDto extends createZodDto(getMeGroupAdminRqs) {}