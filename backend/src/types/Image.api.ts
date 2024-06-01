import type { ImageT, ImageFormT } from "./Image";

// (POST) /
export type CreateRqs = {form: ImageFormT}
export type CreateRsp = ImageT