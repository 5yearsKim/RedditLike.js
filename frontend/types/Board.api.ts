import type { BoardFormT, BoardT, GetBoardOptionT, ListBoardOptionT } from "./Board";

// (POST) /
export type CreateRqs = {form: BoardFormT }
export type CreateRsp = BoardT

// (GET) /:id
export type GetRqs = GetBoardOptionT
export type GetRsp = GetData<BoardT>

// (GET) /:id/group-check/:groupKey
export type GetWithGroupCheckRqs = GetBoardOptionT
export type GetWithGroupCheckRsp = GetData<BoardT>

// (PATCH) /:id
export type UpdateRqs = {form: Partial<BoardFormT> }
export type UpdateRsp = BoardT

// (GET) /
export type ListRqs = ListBoardOptionT
export type ListRsp = ListData<BoardT>

// (GET) /by-name/:name
export type GetByNameAndRqs = GetBoardOptionT
export type GetByNameRsp = GetData<BoardT|null>

// (PATCH) /:id/admin-trash
export type AdminTrashRqs = null
export type AdminTrashRsp = BoardT

// (PATCH) /:id/admin-restore
export type AdminRestoreRqs = null
export type AdminRestoreRsp = BoardT

// (POST) /avatar/presigned-url
export type AvatarPresignedUrlRqs = {boardId: idT, mimeType: string}
export type AvatarPresignedUrlRsp = {putUrl: string, key: string}

// (POST) /bg-cover/presigned-url
export type BgCoverPresignedUrlRqs = {boardId: idT, mimeType: string}
export type BgCoverPresignedUrlRsp = {putUrl: string, key: string}

// (POST) /default-avatar/presigned-url
export type DefaultAvatarPresignedUrlRqs = {boardId: idT, mimeType: string}
export type DefaultAvatarPresignedUrlRsp = {putUrl: string, key: string}