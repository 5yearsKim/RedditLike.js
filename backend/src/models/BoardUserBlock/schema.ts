import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const boardUserBlockFormZ = {
  board_id: z.number().int(),
  from_id: z.number().int(),
  target_id: z.number().int(),
};

export const boardUserBlockFormSchema = insertFormSchema.extend(boardUserBlockFormZ);

export const boardUserBlockSchema = baseModelSchema.extend(boardUserBlockFormZ);

export const getBoardUserBlockOptionSchema = getOptionSchema.extend({
  $board: z.coerce.boolean(),
  $target: z.coerce.boolean(),
}).partial();
export const listBoardUserBlockOptionSchema = getBoardUserBlockOptionSchema.extend({}).partial();


const tgKey = "BoardUserBlock";

TG.add(tgKey, "BoardUserBlockFormT", boardUserBlockFormSchema);
TG.add(tgKey, "_BoardUserBlockT", boardUserBlockSchema, { private: true });

TG.add(tgKey, "GetBoardUserBlockOptionT", getBoardUserBlockOptionSchema);
TG.add(tgKey, "ListBoardUserBlockOptionT", listBoardUserBlockOptionSchema);

