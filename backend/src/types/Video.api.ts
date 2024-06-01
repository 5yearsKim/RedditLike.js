import type { VideoFormT, VideoT } from "./Video";

// (POST) /
export type CreateRqs = {form: VideoFormT}
export type CreateRsp = VideoT