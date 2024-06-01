import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { subDays, subMonths, subYears, startOfHour } from "date-fns";
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";

export type FromRangeT = "1d" | "7d" | "1M" | "3M" | "1y" | "all";

type RangeSelectorProps = {
  initialRange?: FromRangeT;
  candidates?: FromRangeT[];
  onChange: (value: Date | undefined) => void;
};


function range2date(val: FromRangeT): Date | undefined {
  let newDate = new Date();
  switch (val) {
  case "1d":
    newDate = subDays(newDate, 1);
    break;
  case "7d":
    newDate = subDays(newDate, 7);
    break;
  case "1M":
    newDate = subMonths(newDate, 1);
    break;
  case "3M":
    newDate = subMonths(newDate, 3);
    break;
  case "1y":
    newDate = subYears(newDate, 1);
    break;
  case "all":
    return undefined;
  default:
    return undefined;
  }
  return startOfHour(newDate);
}


export function RangeSelector({
  initialRange,
  candidates,
  onChange,
}: RangeSelectorProps): JSX.Element {
  const t = useTranslations("components.RangeSelector");

  const cands: { key: FromRangeT; label: string;}[] = [
    {
      key: "1d",
      label: t("today"),
    },
    {
      key: "7d",
      label: t("1week"),
    },
    {
      key: "1M",
      label: t("1month"),
    },
    {
      key: "3M",
      label: t("3month"),
    },
    {
      key: "1y",
      label: t("1year"),
    },
    {
      key: "all",
      label: t("all"),
    },
  ];

  const [from, setFrom] = useState<FromRangeT>(initialRange ?? "all");

  const rangeCands = useMemo(() => {
    if (!candidates) {
      return cands;
    }
    return cands.filter((cand) => candidates.includes(cand.key));
  }, []);

  function handleFromRangeChange(e: SelectChangeEvent): void {
    const newVal = e.target.value as FromRangeT;
    // onChange(newVal);
    setFrom(newVal);

    const fromAt = range2date(newVal);
    onChange(fromAt);
  }


  return (
    <FormControl>
      <InputLabel>{t("publishedAt")}</InputLabel>
      <Select
        label={t("publishedAt")}
        variant='outlined'
        value={from}
        onChange={handleFromRangeChange}
        size='small'
      >
        {rangeCands.map((item) => {
          return (
            <MenuItem
              key={item.key}
              value={item.key}
              sx={{ justifyContent: "center" }}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
