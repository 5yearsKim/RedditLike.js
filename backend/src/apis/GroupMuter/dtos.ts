import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { groupMuterFormSchema, getGroupMuterOptionSchema, listGroupMuterOptionSchema } from "@/models/GroupMuter";


// create
const createGroupMuterRqs = z.object({ form: groupMuterFormSchema });
export class CreateGroupMuterDto extends createZodDto(createGroupMuterRqs) {}

// list
const listGroupMuterRqs = listGroupMuterOptionSchema;
export class ListGroupMuterDto extends createZodDto(listGroupMuterRqs) {}

// delete
// no dto

// getMe
const getMeGroupMuterRqs = z.object({ groupId: z.coerce.number().int().positive() });
export class GetMeGroupMuterDto extends createZodDto(getMeGroupMuterRqs) {}
