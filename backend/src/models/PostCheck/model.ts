import { DataModel } from "@/utils/orm";
import type { PostCheckFormT, PostCheckT } from "@/types/PostCheck";


const table = "post_checks";
export const postCheckM = new DataModel<PostCheckFormT, PostCheckT>(table);
