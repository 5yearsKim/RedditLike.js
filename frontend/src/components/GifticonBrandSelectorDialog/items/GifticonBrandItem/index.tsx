import React from "react";
import Image from "next/image";
import { Box, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import type { GifticonBrandT } from "@/types";

type GifticonBrandItemProps = {
  gifticonBrand: GifticonBrandT;
  size?: "small" | "medium";
};

export function GifticonBrandItem(props: GifticonBrandItemProps): JSX.Element {
  const { gifticonBrand: brand, size } = props;

  const width = size == "small" ? 80 : 100;

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      maxWidth={width}
    >
      <Image
        src={brand.data.brandIConImg}
        alt={brand.brand_name}
        width={width}
        height={width}
      />
      <Gap y={1} />
      <Txt
        fontWeight={500}
        variant='body2'
      >
        {brand.brand_name}
      </Txt>
    </Box>
  );
}
