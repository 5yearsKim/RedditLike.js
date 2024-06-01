import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const boardManagerFormZ = {
  user_id: z.number().int(),
  board_id: z.number().int(),
  is_super: z.boolean().optional(),

  manage_censor: z.boolean().optional(),
  manage_manager: z.boolean().optional(),
  manage_muter: z.boolean().optional(),
  manage_write: z.boolean().optional(),
  manage_intro: z.boolean().optional(),
  manage_info: z.boolean().optional(),
  manage_exposure: z.boolean().optional(),
  manage_contents: z.boolean().optional(),
  manage_etc: z.boolean().optional(),
};

export const boardManagerFormSchema = insertFormSchema.extend(boardManagerFormZ);

export const boardManagerSchema = baseModelSchema.extend({
  ...boardManagerFormZ,
  // optional with default value
  is_super: z.boolean(),
  manage_censor: z.boolean(),
  manage_manager: z.boolean(),
  manage_muter: z.boolean(),
  manage_write: z.boolean(),
  manage_intro: z.boolean(),
  manage_info: z.boolean(),
  manage_exposure: z.boolean(),
  manage_contents: z.boolean(),
  manage_etc: z.boolean(),
});

export const getBoardManagerOptionSchema = getOptionSchema.extend({
  $author: z.coerce.boolean(),
}).partial();
export const listBoardManageOptionSchema = getBoardManagerOptionSchema.extend({
  boardId: z.coerce.number().int(),
}).partial();


const tgKey = "BoardManager";

TG.add(tgKey, "BoardManagerFormT", boardManagerFormSchema);
TG.add(tgKey, "_BoardManagerT", boardManagerSchema, { private: true });

TG.add(tgKey, "GetBoardManagerOptionT", getBoardManagerOptionSchema);
TG.add(tgKey, "ListBoardManagerOptionT", listBoardManageOptionSchema);
