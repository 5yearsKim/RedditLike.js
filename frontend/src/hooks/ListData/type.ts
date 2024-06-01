export type LoadOptionT = {
  force?: boolean;
  skipLoading?: boolean;
  onSuccess?: () => void;
};

export type ListDataT<ModelT extends BaseModelT, ListDataArgT extends object> = {
  status: ProcessStatusT;
  listArg: ListDataArgT;
  data: ModelT[];
  nextCursor: null | string;
  appendingStatus: ProcessStatusT;
  lastUpdated: Date|null
  lastKey?: string
};

export interface ListDataConfigT<ModelT extends BaseModelT, ListDataArgT extends object> {
  listFn: (listArg: ListDataArgT) => Promise<ListData<ModelT>>;
  cacheCfg?: {
    genKey: (listArg: ListDataArgT) => string;
    ttl?: number; // in ms
  }
};
