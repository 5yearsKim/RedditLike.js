"use client";
import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { PostSortChips } from "@/components/PostSortChips";
import { Container, Gap, Expand, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { BoardPostList } from "./BoardPostList";
import { NoRightIndicator } from "../../NoRightIndicator";
// logic
import { atom, useRecoilState } from "recoil";
import { SelectChangeEvent } from "@mui/material";
import { CensorFilterT, PostSortT } from "@/types";
import { useBoardMain$ } from "@/stores/BoardMainStore";


const sortState = atom<PostSortT>({
  key: "sort_ManagingCensor",
  default: "recent",
});

const fromAtState = atom<undefined | Date>({
  key: "fromAt_ManagingCensor",
  default: undefined,
});

const censorState = atom<CensorFilterT | undefined>({
  key: "censor_ManagingCensor",
  default: undefined,
});


export function CensorTab(): ReactNode {
  const t = useTranslations("pages.ManagingPage.CensorTab");
  const boardMain$ = useBoardMain$();
  const [sort, setSort] = useRecoilState(sortState);
  const [fromAt, setFromAt] = useRecoilState(fromAtState);
  const [censor, setCensor] = useRecoilState(censorState);

  function handleSortChange(newSort: PostSortT): void {
    setSort(newSort);
  }

  function handleFromAtChange(val: Date | undefined): void {
    setFromAt(val);
  }

  function handleCensorChange(e: SelectChangeEvent): void {
    const newVal = e.target.value as CensorFilterT | "all";
    if (newVal === "all") {
      setCensor(undefined);
    } else {
      setCensor(newVal);
    }
  }

  const censorCands: { key: CensorFilterT | "all"; label: string }[] = [
    { key: "all", label: t("all") },
    { key: "exceptProcessed", label: t("exceptProcessed") },
    { key: "trashed", label: t("trashed") },
    { key: "approved", label: t("approved") },
  ];

  const { board, manager } = boardMain$.data!;

  const { downSm } = useResponsive();

  if (!manager?.manage_censor) {
    return <NoRightIndicator title={t("postCensor")}/>;
  }

  return (
    <Container rtlP>
      <Txt variant='h5'>{t("postCensor")}</Txt>

      <Box mt={{ xs: 0, sm: 4 }} />

      <Container maxWidth='sm'>
        <Stack
          display='flex'
          flexDirection={{ xs: "column-reverse", sm: "row" }}
          alignItems={{ xs: "flex-end", sm: "center" }}
        >
          <PostSortChips
            sort={sort}
            size={downSm ? "small" : "medium"}
            onChange={handleSortChange}
            onFromAtChange={handleFromAtChange}
          />

          <Expand />

          <FormControl>
            <InputLabel>{t("processStatus")}</InputLabel>
            <Select
              label={t("processStatus")}
              variant='outlined'
              size='small'
              value={censor ?? "all"}
              onChange={handleCensorChange}
            >
              {censorCands.map((item) => {
                return (
                  <MenuItem
                    key={item.key}
                    value={item.key}
                  >
                    {item.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>

        <Gap y={2} />

        <BoardPostList
          boardId={board.id}
          sort={sort}
          censor={censor}
          fromAt={fromAt}
          manager={manager}
        />
      </Container>
    </Container>
  );
}
