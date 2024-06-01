import { createZodDto } from "nestjs-zod";
import { listPostManagingLogOptionSchema } from "@/models/PostManagingLog";


// list
const listPostManagingLogRqs = listPostManagingLogOptionSchema;
export class ListPostManagingLogDto extends createZodDto(listPostManagingLogRqs) {}
