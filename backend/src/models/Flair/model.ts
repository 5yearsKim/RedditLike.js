import { DataModel, SqlInjector } from "@/utils/orm";
import type { FlairFormT, FlairT } from "@/types/Flair";


const table = "flairs";
export const flairM = new DataModel<FlairFormT, FlairT>(table);


export class FlairSqls extends SqlInjector {
  constructor() {
    super(table);
  }
}
