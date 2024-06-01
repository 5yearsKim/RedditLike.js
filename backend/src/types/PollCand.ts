export type PollCandFormT = {
    poll_id: number;
    label: string;
    thumb_path?: (string | null) | undefined;
    rank?: (number | null) | undefined;
}

type _PollCandT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    poll_id: number;
    label: string;
    thumb_path?: (string | null) | undefined;
    rank?: (number | null) | undefined;
}

export type GetPollCandOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $num_vote?: boolean | undefined;
    $my_vote?: boolean | undefined;
}

export type ListPollCandOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $num_vote?: (boolean | undefined) | undefined;
    $my_vote?: (boolean | undefined) | undefined;
    pollId?: number | undefined;
}


// @type-gen remain
import { PollVoteT } from "./PollVote";

export interface PollCandT extends _PollCandT {
  num_vote?: number;
  my_vote?: PollVoteT;
}