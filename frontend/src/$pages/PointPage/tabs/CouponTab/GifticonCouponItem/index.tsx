import React from "react";
import Image from "next/image";
import { ButtonBase, CircularProgress } from "@mui/material";
import { Row, Expand, Gap, Box } from "@/ui/layouts";
import { Txt, EllipsisTxt } from "@/ui/texts";
import { red, green, blue } from "@mui/material/colors";
import { Deactivate } from "@/ui/tools/Deactivate";
import { addDays, format as dfFormat } from "date-fns";
// logic
import { useEffect, useState } from "react";
import * as GifticonCouponApi from "@/apis/gifticon_coupons";
import type { GifticonCouponT } from "@/types";

type GifticonCouponItemProps = {
  gifticonCoupon: GifticonCouponT;
  size?: "small" | "medium";
  onClick: () => void;
};


export function GifticonCouponItem({
  gifticonCoupon: coupon,
  size = "medium",
  onClick,
}: GifticonCouponItemProps): JSX.Element {
  const [status, setStatus] = useState<ProcessStatusT>("init");
  const [giftishowInfo, setGiftishowInfo] = useState<any | undefined>(undefined);

  const giftishowStatus: string | null = giftishowInfo?.pinStatusCd ?? coupon.last_giftishow_status ?? null;

  useEffect(() => {
    if (coupon.last_giftishow_status == null || coupon.last_giftishow_status == "01") {
      init();
    }
  }, []);

  async function init(): Promise<void> {
    try {
      setStatus("loading");
      const { giftishowInfo } = await GifticonCouponApi.fetch(coupon.id);
      setGiftishowInfo(giftishowInfo);
      setStatus("loaded");
    } catch (e) {
      console.warn(e);
      setStatus("error");
    }
  }


  const imgW = size == "small" ? 80 : 100;

  const createDay = new Date(coupon.created_at);
  const untilDay = addDays(createDay, coupon.product?.data.limitDay ?? 0);

  function renderStatus(): JSX.Element {
    if (!giftishowStatus) {
      return <></>;
    }
    const commonSx = {
      fontWeight: 500,
      fontSize: 14,
    };
    if (status == "loading") {
      return <CircularProgress size='1.5rem' />;
    }
    if (coupon.is_cancelled) {
      return <Txt sx={{ ...commonSx, color: red[400] }}>취소됨</Txt>;
    }
    switch (giftishowStatus) {
    case "01":
      return <Txt sx={{ ...commonSx, color: green[400] }}>사용 가능</Txt>;
    case "02":
      return <Txt sx={{ ...commonSx, color: blue[400] }}>사용 완료</Txt>;
    case "03":
      return <Txt sx={{ ...commonSx, color: red[400] }}>반품</Txt>;
    case "04":
      return <Txt sx={{ ...commonSx, color: red[400] }}>관리 폐기</Txt>;
    case "05":
      return <Txt sx={{ ...commonSx, color: red[400] }}>환불</Txt>;
    case "06":
      return <Txt sx={{ ...commonSx, color: red[400] }}>재발행</Txt>;
    case "07":
      return <Txt sx={{ ...commonSx, color: red[400] }}>구매 취소</Txt>;
    case "08":
      return <Txt sx={{ ...commonSx, color: red[400] }}>기간 만료</Txt>;
    case "09":
      return <Txt sx={{ ...commonSx, color: red[400] }}>(비활성)</Txt>;
    case "10":
      return <Txt>전액 환불</Txt>;
    default:
      return <Txt>상태코드 ({giftishowStatus})</Txt>;
    }
  }

  return (
    <Deactivate on={Boolean(giftishowStatus) && giftishowStatus !== "01"}>
      <ButtonBase onClick={onClick}>
        <Row
          m={1}
          width='100%'
        >
          <Expand>
            <Row>
              <EllipsisTxt
                variant='subtitle2'
                fontWeight={700}
                maxLines={1}
              >
                {coupon.product?.product_name}
              </EllipsisTxt>
            </Row>
            <Gap y={1} />
            <EllipsisTxt
              color='vague.light'
              maxLines={2}
            >
              {coupon.product?.data.content}
            </EllipsisTxt>
            <Gap y={1} />
            <Row>
              <Txt
                variant='body2'
                fontWeight={700}
                color='primary.main'
              >
                {dfFormat(createDay, "yy/MM/dd")} ~ {dfFormat(untilDay, "yy/MM/dd")}
              </Txt>
              <Expand />
              <Box mx={1}>{renderStatus()}</Box>
            </Row>
          </Expand>

          <Gap x={1} />

          <Box
            borderRadius={2}
            overflow='hidden'
          >
            <Image
              src={coupon.giftishow_data?.couponImgUrl}
              alt='gifticon'
              width={imgW}
              height={imgW}
              style={{
                objectFit: "cover",
              }}
            />
          </Box>
        </Row>
      </ButtonBase>
    </Deactivate>
  );
}
