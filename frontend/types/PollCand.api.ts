import { PollCandT, ListPollCandOptionT } from "./PollCand";

// (GET) /
export type ListRqs = ListPollCandOptionT
export type ListRsp = ListData<PollCandT>


// (POST) /thumbnail/presigned-url
export type ThumbnailPresignedUrlRqs = {mimeType: string}
export type ThumbnailPresignedUrlRsp = {putUrl: string, key: string}
