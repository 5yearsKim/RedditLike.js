import React, { useState, useRef, useImperativeHandle, forwardRef, ReactNode } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Keyboard } from "swiper/modules";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { SwiperRef } from "swiper/react";

import { Box } from "@/ui/layouts";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { FullBox } from "./style";


export type ImageSliderT = {
  getScale: () => number;
  getActiveIdx: () => number;
  slideTo: (idx: number) => void;
};

type ImageSliderProps = {
  imgs: string[];
  height: string;
  initialIdx?: number;
  showNavigation?: boolean;
  isFull?: boolean;
  // onTransform?: (scale: number, prevScale: number) => void
};


export const ImageSlider = forwardRef<ImageSliderT, ImageSliderProps>((props: ImageSliderProps, ref): ReactNode => {

  const { imgs, height, initialIdx, showNavigation, isFull } = props;

  const swiperRef = useRef<SwiperRef | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(initialIdx ?? 0);
  const [scale, setScale] = useState<number>(1.0);

  const allowSlide = scale < 1.3;

  useImperativeHandle(ref, () => ({
    getScale(): number {
      return scale;
    },
    getActiveIdx(): number {
      return activeIdx;
    },
    slideTo(idx: number): void {
      swiperRef.current?.swiper.slideTo(idx);
    },
  }));

  function handleTransform(scale: number, prevScale: number): void {
    if (scale == prevScale) {
      return;
    }
    setScale(scale);
  }

  function handleActiveIdxChange(idx: number): void {
    setActiveIdx(idx);
  }


  return (
    <Swiper
      ref={swiperRef}
      pagination={{
        type: "fraction",
      }}
      allowSlideNext={allowSlide}
      allowSlidePrev={allowSlide}
      keyboard={{ enabled: true }}
      navigation={showNavigation}
      initialSlide={initialIdx}
      onRealIndexChange={(swiper): void => handleActiveIdxChange(swiper.activeIndex)}
      modules={[Pagination, Navigation, Keyboard]}
    >
      {imgs.map((img, idx) => (
        <SwiperSlide key={idx}>
          <TransformWrapper
            panning={{ disabled: allowSlide }}
            onTransformed={(ref): void => handleTransform(ref.state.scale, ref.state.previousScale)}
          >
            <TransformComponent
              wrapperStyle={{ width: "100%" }}
              contentStyle={{ width: "100%" }}
            >
              <FullBox isFull={isFull ?? false}>
                <Box
                  position='relative'
                  // bgcolor='#55ff55'
                  p={2}
                  width='100%'
                  minWidth='100px'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  height={height}
                >
                  <Image
                    src={img}
                    alt={`slider-img-${idx}`}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              </FullBox>
            </TransformComponent>
          </TransformWrapper>
        </SwiperSlide>
      ))}
    </Swiper>
  );
});
