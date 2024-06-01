import { DataModel } from "@/utils/orm";
import type { PollCandFormT, PollCandT } from "@/types/PollCand";


const table = "poll_cands";
export const pollCandM = new DataModel<PollCandFormT, PollCandT>(table);


