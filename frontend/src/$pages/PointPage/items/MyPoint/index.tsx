import React, { useMemo, CSSProperties } from "react";


import dynamic from "next/dynamic";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { PointImage } from "@/ui/images";

const AnimatedNumber = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});


export const MyPoint = React.memo(MyPointView);

type MyPointProps = {
  point: number;
};

export function MyPointView(props: MyPointProps): JSX.Element {
  const { point } = props;

  const initPoint = useMemo(() => point, []);

  const tStyle: CSSProperties = {
    fontSize: 16,
    fontWeight: 500,
  };

  return (
    <Row>
      <Txt sx={tStyle}>내 포인트: </Txt>
      <Gap x={1} />
      {/* <Txt>{point.toLocaleString()}</Txt> */}
      {initPoint == point ? (
        <Txt sx={tStyle}>{point.toLocaleString()}</Txt>
      ) : (
        <AnimatedNumber
          fontStyle={tStyle}
          animateToNumber={point}
          includeComma
          locale='en-US'
          // configs={[{ tension: 100, friction: 20 }]}
          // onStart={() => console.log("onStart")}
          // onFinish={() => console.log("onFinish")}
        />
      )}

      <Gap x={1} />
      <PointImage fontSize={18} />
    </Row>
  );
}
