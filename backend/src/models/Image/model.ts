import { DataModel } from "@/utils/orm";
import type { ImageFormT, ImageT } from "@/types/Image";


const table = "images";
export const imageM = new DataModel<ImageFormT, ImageT>(table);


