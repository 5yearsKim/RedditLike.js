import { useState, useEffect, useCallback } from "react";
import * as BoardApi from "@/apis/boards";
import { debounce } from "@mui/material/utils";
import { useGroup } from "@/stores/GroupStore";
import type { BoardT, ListBoardOptionT } from "@/types";

export function useBoardSearch({ query }: { query: string }) {
  const [status, setStatus] = useState<ProcessStatusT>("init");
  const [boardCand, setBoardCand] = useState<BoardT[]>([]);

  const group = useGroup();


  useEffect(() => {
    if (query.length == 0) {
      setStatus("init");
      setBoardCand([]);
    } else {
      setStatus("loading");
      bringCandidates(query);
    }
  }, [query]);

  const bringCandidates = useCallback(
    debounce(async (q: string) => {

      const listOpt: ListBoardOptionT = {
        groupId: group.id,
        censor: "exceptTrashed",
        search: q,
      };
      try {
        setStatus("loading");
        const { data: fetched } = await BoardApi.list(listOpt);
        setStatus("loaded");
        setBoardCand(fetched);
      } catch (e) {
        setStatus("error");
      }
    }, 500),
    [],
  );

  function reset(): void {
    setStatus("init");
    setBoardCand([]);
  }

  return {
    status,
    boardCand,
    reset,
  };
}
