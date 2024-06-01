import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const boardFollowerFormZ = {
  user_id: z.number().int(),
  board_id: z.number().int(),
};

export const boardFollowerFormSchema = insertFormSchema.extend(boardFollowerFormZ);

export const boardFollowerSchema = baseModelSchema.extend(boardFollowerFormZ);


const tgKey = "BoardFollower";

TG.add(tgKey, "BoardFollowerFormT", boardFollowerFormSchema);
export type BoardFollowerFormT = z.infer<typeof boardFollowerFormSchema>;
TG.add(tgKey, "BoardFollowerT", boardFollowerSchema);
export type BoardFollowerT = z.infer<typeof boardFollowerSchema>;

