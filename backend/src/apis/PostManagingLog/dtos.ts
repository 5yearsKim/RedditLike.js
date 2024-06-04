import { createZodDto } from "nestjs-zod";
import { listPostManagingLogOptionSchema } from "@/models/PostManagingLog";


// list
export class ListPostManagingLogDto extends createZodDto(listPostManagingLogOptionSchema) {}
