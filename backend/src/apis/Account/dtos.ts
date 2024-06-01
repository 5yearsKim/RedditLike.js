import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { accountFormSchema, listAccountOptionSchema } from "@/models/Account";

// create
const createRqs = z.object({ form: accountFormSchema });
export class CreateAccountDto extends createZodDto(createRqs) {}

// list
const listRqs = listAccountOptionSchema;
export class ListAccountDto extends createZodDto(listRqs) {}