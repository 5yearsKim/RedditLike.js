import { useSetRecoilState, useRecoilCallback, type RecoilState } from "recoil";

export interface StoreStateT<DataT> {
  status: ProcessStatusT
  data?: DataT
  lastUpdated: Date|null
  lastKey?: string
}

export interface StoreActionsOptionT<DataT, LoadArgT> {
  state: RecoilState<StoreStateT<DataT>>,
  loadFn: (arg: LoadArgT) => Promise<DataT>,
  cacheCfg?: {
    genKey: (arg: LoadArgT) => string
    ttl?: number // in ms
  }
}

export interface LoadOptionT {
  force?: boolean
  skipLoading?: boolean
}


export function useStoreActions<DataT, LoadArgT extends object>({
  state,
  loadFn,
  cacheCfg,
}: StoreActionsOptionT<DataT, LoadArgT>) {
  const set = useSetRecoilState(state);


  function patch(state: Partial<StoreStateT<DataT>>) {
    set((prev) => ({ ...prev, ...state }));
  }

  function patchData(data: Partial<DataT>) {
    set((prev) => {
      if (prev.data === undefined) {
        return prev;
      }
      return { ...prev, data: { ...prev.data, ...data } };
    });
  }

  const load = useRecoilCallback(
    ({ snapshot }) => async (loadArg: LoadArgT, loadOpt: LoadOptionT = {}) => {
      const prevState = snapshot.getLoadable(state).getValue();

      const isForce = loadOpt.force ||
        !cacheCfg ||
        (prevState.lastKey !== cacheCfg.genKey(loadArg)) ||
        (cacheCfg.ttl && prevState.lastUpdated && (new Date().getTime() - prevState.lastUpdated.getTime() > cacheCfg.ttl));

      if (prevState.status === "loading") {
        return;
      }
      if (prevState.status === "loaded" && !isForce) {
        return;
      }

      try {
        if (!loadOpt.skipLoading) {
          patch({ status: "loading" });
        }

        const data = await loadFn(loadArg);

        patch({ status: "loaded", data: data, lastUpdated: new Date(), lastKey: cacheCfg?.genKey(loadArg) });
      } catch (e) {
        console.warn("load error: ", e);
        set({ status: "error", lastUpdated: null });
      }
    }
  );

  return {
    set,
    patch,
    patchData,
    load,
  };
}


