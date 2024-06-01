import React, { Fragment } from "react";

import { SelectableChip } from "@/ui/tools/SelectableChip";
import { Row } from "@/ui/layouts";
// import { RadioGroup, FormControl, FormControlLabel, Radio } from '@mui/material';

interface DefaultSortSelector<MySortT> {
  sortCands: { label: string; sort: MySortT }[];
  value: MySortT;
  size?: "medium" | "small";
  onChange: (sort: MySortT) => void;
}

export function DefaultSortSelector<MySortT>(props: DefaultSortSelector<MySortT>): JSX.Element {
  const { sortCands, value, size, onChange } = props;

  function handleChipClick(sort: MySortT): void {
    onChange(sort);
  }

  return (
    <Row
      columnGap={0.5}
      flexWrap='wrap'
    >
      {sortCands.map((cand) => {
        return (
          <Fragment key={cand.label}>
            <SelectableChip
              label={cand.label}
              selected={value == cand.sort}
              size={size}
              onClick={(): void => handleChipClick(cand.sort)}
            />
          </Fragment>
        );
      })}
    </Row>
  );
}
