import { DataModel } from "@/utils/orm";
import type { FlairBoxFormT, FlairBoxT } from "@/types/FlairBox";


const table = "flair_boxes";
export const flairBoxM = new DataModel<FlairBoxFormT, FlairBoxT>(table);

