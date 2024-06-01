import { useState, useEffect, useCallback } from "react";
import { debounce } from "@mui/material/utils";

type UniqueStatusT = "init" | "checking" | "unique" | "duplicate";

type UniqueCheckOptionT = {
  text: string;
  checkUnique: (text: string) => Promise<boolean>;
  forceCheck?: (text: string) => UniqueStatusT | undefined;
};

// eslint-disable-next-line
export function useUniqueCheck(option: UniqueCheckOptionT) {
  const { text, checkUnique, forceCheck } = option;
  const [uniqueStatus, setUniqueStatus] = useState<UniqueStatusT>("init");

  useEffect(() => {
    _checkUnique.clear();

    const forceCheckResult = forceCheck ? forceCheck(text) : undefined;
    if (forceCheckResult) {
      setUniqueStatus(forceCheckResult);
    } else {
      setUniqueStatus("checking");
      _checkUnique(text);
    }
  }, [text]);

  const _checkUnique = useCallback(
    debounce(async (text: string): Promise<void> => {
      try {
        const isUnique = await checkUnique(text);
        if (isUnique) {
          setUniqueStatus("unique");
        } else {
          setUniqueStatus("duplicate");
        }
      } catch (e) {
        console.warn(e);
      }
    }, 500),
    [],
  );

  return {
    uniqueStatus,
  };
}
