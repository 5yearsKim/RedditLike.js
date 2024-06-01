import { DataModel } from "@/utils/orm";
import type { PostReportFormT, PostReportT } from "@/types/PostReport";


const table = "post_reports";
export const postReportM = new DataModel<PostReportFormT, PostReportT>(table);


