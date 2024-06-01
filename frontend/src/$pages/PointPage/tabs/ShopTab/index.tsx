import React from "react";
import { ErrorBox, InitBox, LoadingBox, LoadingIndicator } from "@/components/$statusTools";
import { Grid, Box, Dialog, ButtonBase } from "@mui/material";
import { GridItem, Container, Row, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { useResponsive } from "@/hooks/Responsive";
import { useUrlState } from "@/hooks/UrlState";
import { ListView, AppendError } from "@/ui/tools/ListView";
import { ScrollTopButton } from "@/ui/tools/ScrollTopButton";

import { MyPoint } from "../../items/MyPoint";
import { GifticonBrandSelector } from "./GifticonBrandSelector";
import { GifticonProductItem } from "./GifticonProductItem";
import { PriceFilter } from "./PriceFilter";
import { SortSelector } from "./SortSelector";
import { GifticonProductDetail } from "./GifticonProductDetail";
// logic
import { useEffect, useState } from "react";
import { useListData } from "@/hooks/ListData";
import * as GifticonProductApi from "@/apis/gifticon_products";
import type {
  UserT, GifticonBrandT, ListGifticonProductOptionT,
  GifticonProductT,
} from "@/types";

type ShopTabProps = {
  me: UserT;
};


export function ShopTab({ me }: ShopTabProps): JSX.Element {
  const { data: gifticonProducts$, actions: gifticonProductsAct } = useListData({
    listFn: GifticonProductApi.list,
  });

  const [brand, setBrand] = useState<GifticonBrandT | undefined>(undefined);
  const [sort, setSort] = useState<ListGifticonProductOptionT["sort"]| undefined>(undefined);
  const [priceFilter, setPriceFilter] = useState<{
    min?: number;
    max?: number;
  }>({});

  const [selectedProduct, setSelectedProduct] = useState<GifticonProductT | null>(null);
  const [detailOpen, setDetailOpen] = useUrlState<boolean>({
    key: "detailOpen",
    val2query: (val) => val ? "true" : null,
    query2val: (query) => query == "true",
    backOn: (val) => !val,
  });

  const listOpt: ListGifticonProductOptionT = {
    brandCode: brand?.brand_code,
    maxPrice: priceFilter.max,
    minPrice: priceFilter.min,
    sort: sort,
  };
  useEffect(() => {
    gifticonProductsAct.load(listOpt);
  }, [brand?.brand_code, priceFilter.min, priceFilter.max, sort]);


  function handleErrorRetry(): void {
    gifticonProductsAct.load(listOpt, { force: true });
  }

  function handleLoaderDetect(): void {
    gifticonProductsAct.refill();
  }

  function handleBrandChange(brand: GifticonBrandT | undefined): void {
    setBrand(brand);
  }

  function handlePriceFilterChange(filter: { min?: number; max?: number }): void {
    setPriceFilter(filter);
  }

  function handleSortChange(sort: ListGifticonProductOptionT["sort"]| undefined): void {
    setSort(sort);
  }

  function handleGifticonClick(gifticonProduct: GifticonProductT): void {
    setDetailOpen(true);
    setSelectedProduct(gifticonProduct);
  }

  function handleDetailDialogClose(): void {
    setDetailOpen(false);
    setSelectedProduct(null);
  }

  const { status, data: gifticonProducts, appendingStatus } = gifticonProducts$;
  const { downSm } = useResponsive();

  if (status == "init") {
    return <InitBox height='60vh' />;
  }

  if (status == "loading") {
    return <LoadingBox height='60vh' />;
  }

  if (status == "error") {
    return (
      <ErrorBox
        height='60vh'
        onRetry={handleErrorRetry}
        showHome
      />
    );
  }

  return (
    <Container rtlP>
      <Row>
        <Txt variant='h5'>기프티콘 샵</Txt>
        <Expand />
        <MyPoint point={me.points} />
      </Row>

      <Box
        display='flex'
        py={2}
        sx={{
          overflowX: "scroll",
          overflowY: "visible",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Row columnGap={1}>
          <GifticonBrandSelector
            brand={brand}
            onChange={handleBrandChange}
          />
          <PriceFilter
            filter={priceFilter}
            onChange={handlePriceFilterChange}
          />
          <SortSelector
            sort={sort}
            onChange={handleSortChange}
          />
        </Row>
      </Box>

      <Grid
        container
        spacing={2}
      >
        <ListView
          data={gifticonProducts}
          onLoaderDetect={handleLoaderDetect}
          renderItem={(item): JSX.Element => {
            return (
              <GridItem key={item.id}>
                <ButtonBase onClick={(): void => handleGifticonClick(item)}>
                  <GifticonProductItem
                    gifticonProduct={item}
                    size={downSm ? "small" : "medium"}
                  />
                </ButtonBase>
              </GridItem>
            );
          }}
          renderAppend={(): JSX.Element => {
            if (appendingStatus == "loading") {
              return (
                <GridItem>
                  <LoadingIndicator size='4rem' />
                </GridItem>
              );
            }
            if (appendingStatus == "error") {
              return (
                <GridItem>
                  <AppendError onRetry={handleLoaderDetect} />;
                </GridItem>
              );
            }
            return <></>;
          }}
        />
      </Grid>

      <Box
        position='fixed'
        right={18}
        bottom={20}
      >
        <ScrollTopButton size={downSm ? "small" : "medium"} />
      </Box>

      <Dialog
        maxWidth='sm'
        fullWidth
        open={detailOpen}
        onClose={handleDetailDialogClose}
      >
        {selectedProduct && (
          <Box p={{ xs: 0, sm: 2 }}>
            <GifticonProductDetail
              gifticonProduct={selectedProduct}
              userPoints={me.points}
            />
          </Box>
        )}
      </Dialog>
    </Container>
  );
}
