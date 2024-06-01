import { DataModel } from "@/utils/orm";
import type { UrlInfoFormT, UrlInfoT } from "@/types/UrlInfo";


const table = "url_infos";
export const urlInfoM = new DataModel<UrlInfoFormT, UrlInfoT>(table);

