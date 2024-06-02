import { createZodDto } from "nestjs-zod";
import { listNotificationOptionSchema } from "@/models/Notification";


// list
export class ListNotificationDto extends createZodDto(listNotificationOptionSchema) {}


// checkMe
// no dto