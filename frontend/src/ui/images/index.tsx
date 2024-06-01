import React from "react";
import Image from "next/image";

type PointImageProps = {
  fontSize: number;
};

export function PointImage(props: PointImageProps): JSX.Element {
  const { fontSize } = props;

  return (
    <Image
      src='/images/point_coin.png'
      alt='coin-alt'
      width={fontSize}
      height={fontSize}
      style={{
        marginTop: fontSize / 6,
      }}
    />
  );
}
