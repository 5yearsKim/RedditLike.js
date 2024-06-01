import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";

const boardMuterFormZ = {
  board_id: z.number().int(),
  user_id: z.number().int(),
  until: z.coerce.date().nullish(),
  reason: z.string().max(255).nullish(),
};

export const boardMuterFormSchema = insertFormSchema.extend(boardMuterFormZ);
export const boardMuterSchema = baseModelSchema.extend(boardMuterFormZ);

export const getBoardMuterOptionSchema = getOptionSchema.extend({
  $author: z.coerce.boolean(),
});
export const listBoardMuterOptionSchema = getBoardMuterOptionSchema.extend({
  boardId: z.coerce.number().int(),
});


const tgKey = "BoardMuter";

TG.add(tgKey, "BoardMuterFormT", boardMuterFormSchema);
TG.add(tgKey, "_BoardMuterT", boardMuterSchema, { private: true });

TG.add(tgKey, "GetBoardMuterOptionT", getBoardMuterOptionSchema);
TG.add(tgKey, "ListBoardMuterOptionT", listBoardMuterOptionSchema);
