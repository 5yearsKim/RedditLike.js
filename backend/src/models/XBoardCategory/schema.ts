import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const xBoardCategoryFormZ = {
  category_id: z.number().int(),
  board_id: z.number().int()
};

export const xBoardCategoryFormSchema = insertFormSchema.extend(xBoardCategoryFormZ);

export const xBoardCategorySchema = baseModelSchema.extend(xBoardCategoryFormZ);


const tgKey = "XBoardCategory";

TG.add(tgKey, "XBoardCategoryFormT", xBoardCategoryFormSchema);
TG.add(tgKey, "XBoardCategoryT", xBoardCategorySchema);

