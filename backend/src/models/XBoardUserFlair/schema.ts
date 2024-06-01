import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const xBoardUserFlairFormZ = {
  flair_id: z.number().int(),
  board_user_id: z.number().int(),

  rank: z.number().int().nullish()
};

export const xBoardUserFlairFormSchema = insertFormSchema.extend(xBoardUserFlairFormZ);
export const xBoardUserFlairSchema = baseModelSchema.extend(xBoardUserFlairFormZ);


const tgKey = "XBoardUserFlair";

TG.add(tgKey, "XBoardUserFlairFormT", xBoardUserFlairFormSchema);
TG.add(tgKey, "XBoardUserFlairT", xBoardUserFlairSchema);

