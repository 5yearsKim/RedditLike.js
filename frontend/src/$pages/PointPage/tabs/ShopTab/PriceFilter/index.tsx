"use client";
import React, { useState, ChangeEvent } from "react";
import { Box, Button, Dialog, TextField, ButtonBase } from "@mui/material";
import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { FilterOlIcon } from "@/ui/icons";
import { useUrlState } from "@/hooks/UrlState";

type PriceRangeSampleT = {
  label: string;
  minPrice?: number;
  maxPrice?: number;
};

const priceSamples: PriceRangeSampleT[] = [
  { label: "3천 이하", minPrice: undefined, maxPrice: 3000 },
  { label: "3천 ~ 5천", minPrice: 3000, maxPrice: 5000 },
  { label: "5천 ~ 1만", minPrice: 5000, maxPrice: 10000 },
  { label: "1만 ~ 2만", minPrice: 10000, maxPrice: 20000 },
  { label: "2만 이상", minPrice: 20000, maxPrice: undefined },
];

type PriceFilterProps = {
  filter: { min?: number; max?: number };
  onChange: (val: { min?: number; max?: number }) => void;
};

export function PriceFilter(props: PriceFilterProps): JSX.Element {
  const { filter: initFilter, onChange } = props;

  const [dialogOpen, setDialogOpen] = useUrlState<boolean>({
    key: "priceFilter",
    val2query: (val) => val ? "true" : null,
    query2val: (query) => query == "true",
    backOn: (val) => !val,
  });
  const [filter, setFilter] = useState<{ min?: number; max?: number }>(initFilter);

  const submitDisable = Boolean(filter.min && filter.max && filter.min > filter.max);

  function handleDialogClose(): void {
    setDialogOpen(false);
  }

  function handleFilterButtonClick(): void {
    setDialogOpen(true);
  }

  function handleMinPriceChange(e: ChangeEvent<HTMLInputElement>): void {
    const numStr = e.target.value;
    if (!numStr) {
      setFilter({ ...filter, min: undefined });
    }
    const num = parseInt(numStr);
    if (isNaN(num)) {
      return;
    }
    setFilter({ ...filter, min: num });
  }

  function handleMaxPriceChange(e: ChangeEvent<HTMLInputElement>): void {
    const numStr = e.target.value;
    if (!numStr) {
      setFilter({ ...filter, max: undefined });
    }
    const num = parseInt(numStr);
    if (isNaN(num)) {
      return;
    }
    setFilter({ ...filter, max: num });
  }

  function handleSampleClick(sample: PriceRangeSampleT): void {
    setFilter({ min: sample.minPrice, max: sample.maxPrice });
  }

  function handleSubmit(): void {
    setDialogOpen(false);
    onChange(filter);
  }

  function getFilterSummary(): string {
    if (!initFilter.min && !initFilter.max) {
      return "모든 가격";
    }
    if (!initFilter.min && initFilter.max) {
      return `${initFilter.max.toLocaleString()} 이하`;
    }
    if (initFilter.min && !initFilter.max) {
      return `${initFilter.min.toLocaleString()} 이하`;
    }
    return `${initFilter.min!.toLocaleString()} ~ ${initFilter.max!.toLocaleString()}`;
  }

  return (
    <>
      <Button
        onClick={handleFilterButtonClick}
        variant='outlined'
        sx={{
          borderRadius: 8,
          whiteSpace: "nowrap",
        }}
      >
        <Row>
          <FilterOlIcon fontSize='small' />
          <Box mr={0.5} />
          {getFilterSummary()}
        </Row>
      </Button>

      <Dialog
        maxWidth='xs'
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{ style: { padding: 8 } }}
      >
        <Row
          flexWrap='wrap'
          justifyContent='center'
        >
          {priceSamples.map((sample) => {
            return (
              <Box
                key={sample.label}
                bgcolor='rgba(0, 0, 0, 0.1)'
                mx={0.4}
                my={0.2}
                borderRadius={8}
                display='flex'
                overflow='hidden'
                onClick={(): void => handleSampleClick(sample)}
              >
                <ButtonBase sx={{ px: 0.8, py: 0.3 }}>
                  <Txt variant='body2'>{sample.label}</Txt>
                </ButtonBase>
              </Box>
            );
          })}
        </Row>

        <Gap y={2} />

        <Col
          maxWidth={200}
          margin='auto'
        >
          <TextField
            label='최소 포인트'
            variant='standard'
            autoComplete='off'
            value={filter.min ?? ""}
            onChange={handleMinPriceChange}
            InputLabelProps={{ shrink: true }}
            placeholder='ex) 1000'
          />
          <TextField
            label='최대 포인트'
            variant='standard'
            autoComplete='off'
            value={filter.max ?? ""}
            onChange={handleMaxPriceChange}
            InputLabelProps={{ shrink: true }}
            placeholder='ex) 5000'
          />
        </Col>

        <Gap y={2} />

        <Row justifyContent='flex-end'>
          <Button onClick={handleDialogClose}>취소</Button>
          <Button
            variant='contained'
            disabled={submitDisable}
            onClick={handleSubmit}
          >
            적용
          </Button>
        </Row>
      </Dialog>
    </>
  );
}
