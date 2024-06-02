import { DataModel } from "@/utils/orm";
import type { MuterFormT, MuterT } from "@/types/Muter";


const table = "muters";
export const muterM = new DataModel<MuterFormT, MuterT>(table);
