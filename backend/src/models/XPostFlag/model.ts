import { DataModel, SqlInjector } from "@/utils/orm";
import type { XPostFlagFormT, XPostFlagT } from "./schema";


const table = "x_post_flag";
export const xPostFlagM = new DataModel<XPostFlagFormT, XPostFlagT>(table);


export class XPostFlagSqls extends SqlInjector {
  constructor() {
    super(table);
  }
}
