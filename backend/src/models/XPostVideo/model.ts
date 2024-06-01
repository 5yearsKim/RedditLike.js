import { DataModel } from "@/utils/orm";
import type { XPostVideoFormT, XPostVideoT } from "@/types/XPostVideo";


const table = "x_post_video";
export const xPostVideoM = new DataModel<XPostVideoFormT, XPostVideoT>(table);


