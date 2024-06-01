import { RecoilState, useSetRecoilState } from "recoil";

export type RecentVisitStateT<ItemT> = {
  status: "init"|"loaded"
  meta?: any,
  data: ItemT[];
};

type RecentVisitStoreConfigT<ItemT> = {
  recoilState: RecoilState<RecentVisitStateT<ItemT>>;
  maxItems?: number;
  onDataChange?: (data: ItemT[]) => void;
};
// let cachedData: null | DataT[] = null;
// if (storageKey) {
//   const cachedJson = localStorage.getItem(storageKey);
//   if (cachedJson) {
//     cachedData = JSON.parse(cachedJson);
//   }
// }

// const initialState: RecentVisitStateT<DataT> = {
//   data: cachedData ?? [],
// };

export function useRecentVisitActions<DataT extends BaseModelT>(config: RecentVisitStoreConfigT<DataT>) {
  const { recoilState, onDataChange } = config;
  const maxItems = config.maxItems ?? 10;

  const set = useSetRecoilState(recoilState);

  function push(item: DataT): void {
    set((state) => {
      let newData = state.data.filter((d) => d.id !== item.id);
      newData = [item, ...newData];
      if (newData.length > maxItems) {
        newData = newData.slice(0, maxItems);
      }
      if (onDataChange) {
        onDataChange(newData);
      }
      return {
        meta: state.meta,
        status: "loaded",
        data: newData,
      };
    });
  }

  function removeById(id: idT): void {
    set((state) => {
      const newData = state.data.filter((d) => d.id !== id);
      if (onDataChange) {
        onDataChange(newData);
      }
      return {
        meta: state.meta,
        status: "loaded",
        data: newData,
      };
    });
  }


  return {
    set,
    push,
    removeById,
  };
}
