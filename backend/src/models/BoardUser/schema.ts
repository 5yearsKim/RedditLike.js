import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const boardUserFormZ = {
  user_id: z.number().int(),
  board_id: z.number().int(),

  nickname: z.string().nullish(),
  avatar_path: z.string().nullish(),
};

export const boardUserFormSchema = insertFormSchema.extend(boardUserFormZ);
export const boardUserSchema = baseModelSchema.extend(boardUserFormZ);

export const getBoardUserOptionSchema = getOptionSchema.extend({
  $author: z.boolean(),
}).partial();
export const listBoardUserOptionSchema = getBoardUserOptionSchema.extend({
  boardId: z.number().int(),
  userId: z.number().int(),
  nickname: z.string(),
}).partial();


const tgKey = "BoardUser";

TG.add(tgKey, "BoardUserFormT", boardUserFormSchema);
TG.add(tgKey, "_BoardUserT", boardUserSchema, { private: true });

TG.add(tgKey, "GetBoardUserOptionT", getBoardUserOptionSchema);
TG.add(tgKey, "ListBoardUserOptionT", listBoardUserOptionSchema);

import { flairSchema } from "@/models/Flair";

// author
const authorSchema = z.object({
  id: z.number().int(),
  board_id: z.number().int(),
  default_nickname: z.string().nullable(),
  default_avatar_path: z.string().nullable(),
  use_flair: z.boolean(),
  nickname: z.string().nullable(),
  avatar_path: z.string().nullable(),
  flairs: z.array(flairSchema),
  is_manager: z.boolean(),
  deleted_at: z.coerce.date().nullable(),
  temp_id: z.number().int(),
});

TG.add(tgKey, "AuthorT", authorSchema);

