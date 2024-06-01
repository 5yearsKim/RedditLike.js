import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const boardRuleRangeEnum = z.enum(["all", "post", "comment"]);

const boardRuleFormZ = {
  board_id: z.number().int(),
  title: z.string().min(1).max(255),
  alias: z.string().min(1).max(255).nullish(),
  range: boardRuleRangeEnum,
  description: z.string(),
  rank: z.number().int().nullish(),
};

export const boardRuleFormSchema = insertFormSchema.extend(boardRuleFormZ);

export const boardRuleSchema = baseModelSchema.extend(boardRuleFormZ);

export const getBoardRuleOptionSchema = getOptionSchema.extend({});
export const listBoardRuleOptionSchema = getBoardRuleOptionSchema.extend({
  boardId: z.coerce.number().int()
}).partial();


const tgKey = "BoardRule";

TG.add(tgKey, "BoardRuleRangeT", boardRuleRangeEnum);
TG.add(tgKey, "BoardRuleFormT", boardRuleFormSchema);
TG.add(tgKey, "BoardRuleT", boardRuleSchema);

TG.add(tgKey, "GetBoardRuleOptionT", getBoardRuleOptionSchema);
TG.add(tgKey, "ListBoardRuleOptionT", listBoardRuleOptionSchema);

