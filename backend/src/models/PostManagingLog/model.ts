import { DataModel } from "@/utils/orm";
import type { PostManagingLogFormT, PostManagingLogT } from "@/types/PostManagingLog";


const table = "post_managing_logs";
export const postManagingLogM = new DataModel<PostManagingLogFormT, PostManagingLogT>(table);


