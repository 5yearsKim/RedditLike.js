import { DataModel } from "@/utils/orm";
import type { XPostImageFormT, XPostImageT } from "@/types/XPostImage";


const table = "x_post_image";
export const xPostImageM = new DataModel<XPostImageFormT, XPostImageT>(table);


