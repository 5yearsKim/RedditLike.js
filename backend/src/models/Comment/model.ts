import { DataModel } from "@/utils/orm";
import type { CommentFormT, CommentT } from "@/types/Comment";


const table = "comments";
export const commentM = new DataModel<CommentFormT, CommentT>(table);

