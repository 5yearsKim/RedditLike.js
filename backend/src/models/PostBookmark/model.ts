import { DataModel } from "@/utils/orm";
import type { PostBookmarkFormT, PostBookmarkT } from "@/types/PostBookmark";


const table = "post_bookmarks";
export const postBookmarkM = new DataModel<PostBookmarkFormT, PostBookmarkT>(table);


