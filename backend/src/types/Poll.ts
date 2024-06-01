export type PollFormT = {
    author_id: number;
    title?: (string | null) | undefined;
    description?: (string | null) | undefined;
    allow_multiple?: boolean | undefined;
    expires_at?: (Date | null) | undefined;
}

type _PollT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    author_id: number;
    title?: (string | null) | undefined;
    description?: (string | null) | undefined;
    allow_multiple: boolean;
    expires_at?: (Date | null) | undefined;
}

export type GetPollOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $cands?: boolean | undefined;
}

export type ListPollOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $cands?: boolean | undefined;
}


// @type-gen remain
import type { PollCandT } from "@/types/PollCand";

export interface PollT extends _PollT {
  cands?: PollCandT[];
}