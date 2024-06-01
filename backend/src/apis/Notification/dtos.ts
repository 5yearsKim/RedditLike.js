import { createZodDto } from "nestjs-zod";
import { listNotificationOptionSchema } from "@/models/Notification";


// list
const listRqs = listNotificationOptionSchema;
export class ListNotificationDto extends createZodDto(listRqs) {}


// checkMe
// no dto