import { DataModel } from "@/utils/orm";
import type { PollVoteFormT, PollVoteT } from "@/types/PollVote";


const table = "poll_votes";
export const pollVoteM = new DataModel<PollVoteFormT, PollVoteT>(table);


