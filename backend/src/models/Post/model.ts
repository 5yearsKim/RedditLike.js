import { DataModel } from "@/utils/orm";
import type { PostFormT, PostT } from "@/types/Post";


const table = "posts";
export const postM = new DataModel<PostFormT, PostT>(table);


