import { DataModel } from "@/utils/orm";
import type { PollFormT, PollT } from "@/types/Poll";


const table = "polls";
export const pollM = new DataModel<PollFormT, PollT>(table);


