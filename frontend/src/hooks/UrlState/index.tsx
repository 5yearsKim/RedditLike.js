"use client";

import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UrlStateConfigT<ArgT> = {
  key: string;
  query2val: (query: string|null) => ArgT;
  val2query: (val: ArgT) => string|null;
  backOn?: (val: ArgT) => boolean;
}


export function useUrlState<ArgT>({
  key,
  query2val,
  val2query,
  backOn,
}: UrlStateConfigT<ArgT>) {
  const searchParams = useSearchParams();
  const query = searchParams.get(key);
  const [val, setVal] = useState<ArgT>(query2val(query));

  return _useUrlState({
    key,
    query2val,
    val2query,
    backOn,
    val,
    setVal,
  });
}


interface _UrlStateConfigT<ArgT> extends UrlStateConfigT<ArgT> {
  val: ArgT;
  setVal: Dispatch<SetStateAction<ArgT>>;
}

export function _useUrlState<ArgT>({
  key,
  query2val,
  val2query,
  backOn,
  val,
  setVal,
}: _UrlStateConfigT<ArgT>) {
  const searchParams = useSearchParams();
  const query = searchParams.get(key);
  const router = useRouter();
  const pathname = usePathname();
  const [stateDrive, setStateDrive] = useState<string|null>(null); // true on pathname exist

  useEffect(() => {
    // if state updating going on
    if (stateDrive == pathname) {
      return;
    }
    // drive by query
    const newVal = query2val(query);
    if (newVal !== val) {
      setVal(newVal);
    }
  }, [query]);

  useEffect(() => {
    // if value is updated by query
    if (stateDrive == null) {
      return;
    }

    // drive by state
    const newQuery = val2query(val);
    if (newQuery !== query) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (newQuery) {
        current.set(key, newQuery);
      } else {
        current.delete(key);
      }
      if (backOn && backOn(val)) {
        router.back();
      } else {
        router.push(`${pathname}?${current.toString()}`, { scroll: false });
      }
    }
    setStateDrive(null);
  }, [val]);

  function imperativeSetVal(newVal: ArgT): void {
    setStateDrive(pathname);
    setVal(newVal);
  }

  return [val, imperativeSetVal] satisfies [ArgT, (val: ArgT) => void];
}
