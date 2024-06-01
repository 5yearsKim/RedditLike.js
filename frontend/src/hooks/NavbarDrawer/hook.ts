"use client";
import { useRecoilState, atom } from "recoil";
import { _useUrlState } from "@/hooks/UrlState";
const drawerCands = ["main", "managing", "admin"];

type NavbarDrawerStateT = "main" | "managing" | "admin" | undefined;

const drawerState = atom<NavbarDrawerStateT>({
  key: "drawer",
  default: undefined,
});


export function useNavbarDrawer() {
  const [_drawer, _serDrawer] = useRecoilState(drawerState);
  const [drawer, setDrawer] = _useUrlState<NavbarDrawerStateT>({
    key: "drawer",
    query2val: (query) => {
      if (!query) return undefined;
      return (drawerCands.includes(query) ? query : undefined) as NavbarDrawerStateT;
    },
    val2query: (val) => val ?? null,
    backOn: (val) => val === undefined,
    val: _drawer,
    setVal: _serDrawer,
  });


  const mainOpen = drawer === "main";
  const managingOpen = drawer === "managing";
  const adminOpen = drawer === "admin";


  function openDrawer(state: NavbarDrawerStateT): void {
    setDrawer(state);
  }

  function closeDrawer(): void {
    setDrawer(undefined);
  }


  return {
    mainOpen,
    managingOpen,
    adminOpen,
    openDrawer,
    closeDrawer,
  };
}