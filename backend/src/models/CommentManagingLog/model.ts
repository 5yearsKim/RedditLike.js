import { DataModel } from "@/utils/orm";
import type { CommentManagingLogFormT, CommentManagingLogT } from "@/types/CommentManagingLog";


const table = "comment_managing_logs";
export const commentManagingLogM = new DataModel<CommentManagingLogFormT, CommentManagingLogT>(table);


