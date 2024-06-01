import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { listGroupInvitationOptionSchema } from "@/models/GroupInvitation";
// import { } from "@/types/_";


// list
export class ListGroupInvitationDto extends createZodDto(listGroupInvitationOptionSchema) {}

// invite
export class InviteDto extends createZodDto(z.object({
  groupId: z.number().int(),
  email: z.string().email(),
})) {}
