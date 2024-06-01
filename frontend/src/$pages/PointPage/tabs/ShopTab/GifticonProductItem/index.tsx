import React from "react";
import Image from "next/image";
import { Box } from "@mui/material";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { PointImage } from "@/ui/images";
import type { GifticonProductT } from "@/types";

type GifticonProductItemProps = {
  gifticonProduct: GifticonProductT;
  size?: "small" | "medium";
};

export function GifticonProductItem(props: GifticonProductItemProps): JSX.Element {
  const { gifticonProduct: gifticon, size } = props;

  const imgSize = size == "small" ? "calc(50vw - 24px)" : "205px";
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='flex-start'
      // bgcolor='#ff00ff'
      maxWidth={imgSize}
      minHeight={`calc(${imgSize} + 90px)`}
    >
      <Box
        position='relative'
        width={imgSize}
        height={imgSize}
      >
        <Image
          src={gifticon.data.goodsImgS}
          alt={`gifticon-${gifticon.id}`}
          fill
        />
      </Box>
      <Gap y={1} />
      <Row>
        <Box
          position='relative'
          width={20}
          height={20}
          borderRadius='2px'
          overflow='hidden'
        >
          <Image
            src={gifticon.data.brandIconImg}
            alt={gifticon.data.brandName}
            fill
          />
        </Box>
        <Box mr={0.5} />
        <Txt
          variant='body2'
          fontWeight={700}
        >
          {gifticon.data.brandName}
        </Txt>
      </Row>
      <Row justifyContent='flex-start'>
        <Txt variant='body2'>{gifticon.product_name}</Txt>
      </Row>
      <Row justifyContent='flex-start'>
        <Txt
          variant='body1'
          fontWeight={500}
        >
          {gifticon.real_price.toLocaleString()}
        </Txt>
        <Box mr={0.5} />
        <PointImage fontSize={16} />
      </Row>
    </Box>
  );
}
