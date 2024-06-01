import { RecoilState, useRecoilState } from "recoil";
import { useListDataLogic } from "@/hooks/ListData/hook";
import type { ListDataConfigT, ListDataT } from "@/hooks/ListData/type";

interface ListDataStoreConfigT<ModelT extends BaseModelT, ListDataArgT extends object> extends ListDataConfigT<ModelT, ListDataArgT> {
  recoilState: RecoilState<ListDataT<ModelT, ListDataArgT>>
}

export function useListDataStore<ModelT extends BaseModelT, ListDataArgT extends object>(
  config: ListDataStoreConfigT<ModelT, ListDataArgT>
) {
  const { recoilState, ...rest } = config;
  const [dataInfo, setDataInfo] = useRecoilState(recoilState);
  return useListDataLogic(dataInfo, setDataInfo, rest);
}

export type { ListDataT };