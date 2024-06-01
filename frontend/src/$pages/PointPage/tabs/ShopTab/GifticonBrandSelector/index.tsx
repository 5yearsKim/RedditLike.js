import React from "react";
import Image from "next/image";
import { GifticonBrandSelectorDialog } from "@/components/GifticonBrandSelectorDialog";
import { Button, IconButton } from "@mui/material";
import { CloseIcon, GifticonIcon } from "@/ui/icons";
import { Row, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { useUrlState } from "@/hooks/UrlState";
import type { GifticonBrandT } from "@/types";

type GifticonBrandSelectorProps = {
  brand: GifticonBrandT | undefined;
  onChange: (brand: GifticonBrandT | undefined) => void;
};

export function GifticonBrandSelector(props: GifticonBrandSelectorProps): JSX.Element {
  const { brand, onChange } = props;

  const [brandSelectorOpen, setBrandSelectorOpen] = useUrlState<boolean>({
    key: "brandSelector",
    val2query: (val) => val ? "true" : null,
    query2val: (query) => query == "true",
    backOn: (val) => !val,
  });


  function handleBrandButtonClick(): void {
    setBrandSelectorOpen(true);
  }

  function handleBrandSelectorClose(): void {
    setBrandSelectorOpen(false);
  }

  function handleBrandSelectorSubmit(brand: GifticonBrandT): void {
    onChange(brand);
    setBrandSelectorOpen(false);
  }

  function handleResetBrand(): void {
    onChange(undefined);
  }

  return (
    <>
      {brand ? (
        <Row>
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            borderRadius={4}
            width='fit-content'
            px={1.5}
            py={0.8}
            onClick={handleBrandButtonClick}
            sx={{
              cursor: "pointer",
              bgcolor: "rgba(128, 128, 128, 0.2)",
            }}
          >
            <Box
              position='relative'
              width={20}
              height={20}
              overflow='hidden'
              borderRadius={2}
            >
              <Image
                src={brand.data.brandIConImg}
                alt={brand.brand_name}
                fill
              />
            </Box>
            <Box mr={0.5} />
            <Txt
              variant='body2'
              whiteSpace='nowrap'
            >
              {brand.brand_name}
            </Txt>
          </Box>
          <IconButton
            size='small'
            onClick={handleResetBrand}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </Row>
      ) : (
        <Button
          onClick={handleBrandButtonClick}
          variant='outlined'
          sx={{
            borderRadius: 8,
            whiteSpace: "nowrap",
          }}
        >
          <Row>
            <GifticonIcon fontSize='small' />
            <Box mr={0.5} />
            브랜드
          </Row>
        </Button>
      )}
      <GifticonBrandSelectorDialog
        open={brandSelectorOpen}
        onClose={handleBrandSelectorClose}
        onSubmit={handleBrandSelectorSubmit}
      />
    </>
  );
}
