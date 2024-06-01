"use client";
import React, { Fragment } from "react";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { useResponsive } from "@/hooks/Responsive";
import { Grid, Dialog, Box, Button } from "@mui/material";
import { GridItem, Row, Gap } from "@/ui/layouts";
import { ListView } from "@/ui/tools/ListView";
import { GifticonBrandItem } from "./items/GifticonBrandItem";
import { BrandCategorySelector } from "./items/BrandCategorySelector";
// logic
import { useEffect, useState } from "react";
import { useListData } from "@/hooks/ListData";
import * as GifticonBrandApi from "@/apis/gifticon_brands";
import type { GifticonBrandT, ListGifticonBrandOptionT } from "@/types";

type GifticonBrandSelectorDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (brand: GifticonBrandT) => any;
};


export function GifticonBrandSelectorDialog({
  open,
  onClose,
  onSubmit,
}: GifticonBrandSelectorDialogProps): JSX.Element {

  const { data: gifticonBrands$, actions: gifticonBrandsAct } = useListData({
    listFn: GifticonBrandApi.list,
  });

  const [category, setCategory] = useState<string | undefined>(undefined);

  const [selectedBrand, setSelectedBrand] = useState<undefined | GifticonBrandT>(undefined);

  const submitDisable = !selectedBrand;

  const listOpt: ListGifticonBrandOptionT = {
    category: category,
  };

  useEffect(() => {
    gifticonBrandsAct.load(listOpt);
  }, [category]);

  function handleErrorRetry(): void {
    gifticonBrandsAct.load(listOpt, { force: true });
  }

  function handleLoaderDetect(): void {
    gifticonBrandsAct.refill();
  }

  function handleCategorySelect(val: string | undefined): void {
    setCategory(val);
  }

  function handleDialogClose(): void {
    onClose();
  }

  function handleSelectBrand(brand: GifticonBrandT): void {
    setSelectedBrand(brand);
  }

  function handleSubmit(): void {
    if (!selectedBrand) {
      return;
    }
    onSubmit(selectedBrand);
  }


  const { downSm } = useResponsive();
  const { status, data: gifticonBrands } = gifticonBrands$;

  function renderBody(): JSX.Element {
    if (status == "init") {
      return <InitBox />;
    }
    if (status == "loading") {
      return <LoadingBox />;
    }
    if (status == "error") {
      return <ErrorBox onRetry={handleErrorRetry} />;
    }
    return (
      <Grid
        container
        spacing={2}
        alignItems='center'
        justifyContent='center'
      >
        <ListView
          data={gifticonBrands}
          onLoaderDetect={handleLoaderDetect}
          renderItem={(item): JSX.Element => {
            const isSelected = Boolean(selectedBrand) && item.id == selectedBrand!.id;
            return (
              <Fragment key={item.id}>
                <GridItem>
                  <Box
                    onClick={(): void => handleSelectBrand(item)}
                    sx={{
                      cursor: "pointer",
                      border: isSelected ? "solid 2px red" : 0,
                      p: isSelected ? 0 : "2px",
                    }}
                  >
                    <GifticonBrandItem
                      gifticonBrand={item}
                      size={downSm ? "small" : "medium"}
                    />
                  </Box>
                </GridItem>
              </Fragment>
            );
          }}
        />
      </Grid>
    );
  }

  return (
    <Dialog
      open={open}
      maxWidth='sm'
      fullScreen={downSm}
      onClose={handleDialogClose}
      PaperProps={{
        style: { padding: "8px" },
      }}
    >
      <BrandCategorySelector
        selected={category}
        onSelect={handleCategorySelect}
      />

      <Gap y={2} />

      <Box
        minHeight='60vh'
        overflow='auto'
        flex={1}
      >
        {renderBody()}
      </Box>

      <Gap y={1} />

      <Row justifyContent='flex-end'>
        <Button onClick={handleDialogClose}>취소</Button>
        <Button
          disabled={submitDisable}
          variant='contained'
          onClick={handleSubmit}
        >
          적용
        </Button>
      </Row>
    </Dialog>
  );
}
