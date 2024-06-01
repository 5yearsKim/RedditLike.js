import { DataModel, SqlInjector } from "@/utils/orm";
import type { FlagFormT, FlagT } from "@/types/Flag";


const table = "flags";
export const flagM = new DataModel<FlagFormT, FlagT>(table);


export class FlagSqls extends SqlInjector {
  constructor() {
    super(table);
  }
}
