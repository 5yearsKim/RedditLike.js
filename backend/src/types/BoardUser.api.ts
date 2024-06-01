import { AuthorT, BoardUserT, BoardUserFormT, ListBoardUserOptionT } from "./BoardUser";


// (POST) /
export type CreateRqs = {form: BoardUserFormT}
export type CreateRsp = BoardUserT

// (GET) /board/:boardId/author
export type GetAuthorRqs = null
export type GetAuthorRsp = GetData<AuthorT|null>

// (GET) /
export type ListBoardUserRqs = ListBoardUserOptionT
export type ListBoardUserRsp = ListData<BoardUserT>

// (GET) /board/:boardId/nickname-unique/:nickname
export type CheckNicknameUniqueRqs = null
export type CheckNicknameUniqueRsp = GetData<boolean>

// (POST) /avatar/presigned-url
export type GetAvatarPresignedUrlRqs = {boardId: idT, mimeType: string}
export type GetAvatarPresignedUrlRsp = {putUrl: string, key: string}