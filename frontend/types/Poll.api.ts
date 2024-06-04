import type { PollFormT, PollT, GetPollOptionT } from "./Poll";
import type { PollCandFormT } from "./PollCand";

// (POST) /
export type CreateRqs = {
  form: PollFormT
  relations?: { cands?: PollCandFormT[] }
}
export type CreateRsp = PollT

// (PATCH) /:id
export type UpdateRqs = {
  form: Partial<PollFormT>
  relations?: { cands?: PollCandFormT[] }
}
export type UpdateRsp = PollT


// (GET) /:id
export type GetRqs = GetPollOptionT
export type GetRsp = GetData<PollT>