import { DataModel } from "@/utils/orm";
import type { PostPinFormT, PostPinT } from "@/types/PostPin";


const table = "post_pins";
export const postPinM = new DataModel<PostPinFormT, PostPinT>(table);

