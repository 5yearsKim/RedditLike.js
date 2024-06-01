import { DataModel } from "@/utils/orm";
import type { VideoFormT, VideoT } from "@/types/Video";


const table = "videos";
export const videoM = new DataModel<VideoFormT, VideoT>(table);


