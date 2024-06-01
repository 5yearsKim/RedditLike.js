import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const boardBlockFormZ = {
  board_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
};

export const boardBlockFormSchema = insertFormSchema.extend(boardBlockFormZ);

export const boardBlockSchema = baseModelSchema.extend(boardBlockFormZ);


const tgKey = "BoardBlock";

TG.add(tgKey, "BoardBlockFormT", boardBlockFormSchema);
TG.add(tgKey, "BoardBlockT", boardBlockSchema);

