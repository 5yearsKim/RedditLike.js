import { DataModel } from "@/utils/orm";
import type { BoardRuleFormT, BoardRuleT } from "@/types/BoardRule";


const table = "board_rules";
export const boardRuleM = new DataModel<BoardRuleFormT, BoardRuleT>(table);
