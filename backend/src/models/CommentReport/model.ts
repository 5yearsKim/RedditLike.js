import { DataModel } from "@/utils/orm";
import type { CommentReportFormT, CommentReportT } from "@/types/CommentReport";


const table = "comment_reports";
export const commentReportM = new DataModel<CommentReportFormT, CommentReportT>(table);


