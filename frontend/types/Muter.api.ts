import {
  MuterFormT, MuterT, ListMuterOptionT,
} from "./Muter";


// (POST) /
export type CreateRqs = {form: MuterFormT}
export type CreateRsp = MuterT

// (GET) /
export type ListRqs = ListMuterOptionT
export type ListRsp = ListData<MuterT>

// (GET) /me
export type GetMeRqs = null
export type GetMeRsp = GetData<MuterT|null>

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = MuterT