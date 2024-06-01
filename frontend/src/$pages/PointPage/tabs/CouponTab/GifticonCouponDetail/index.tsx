import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { Row, Col, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
// logic
import { differenceInHours, format as dfFormat } from "date-fns";
// import { useMeActions } from "@/stores/MeStore";
import * as GifticonCouponApi from "@/apis/gifticon_coupons";
import * as UserApi from "@/apis/users";
import { useSnackbar } from "@/hooks/Snackbar";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useUserActions } from "@/stores/UserStore";
import type { GifticonCouponT } from "@/types";

type GifticonCouponDetailProps = {
  gifticonCoupon: GifticonCouponT;
};

export function GifticonCouponDetail({
  gifticonCoupon: coupon,
}: GifticonCouponDetailProps): JSX.Element {

  const [status, setStatus] = useState<ProcessStatusT>("init");
  const [giftishowInfo, setGiftishowInfo] = useState<any | undefined>(undefined);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const userAct = useUserActions();

  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();

  useEffect(() => {
    init();
  }, []);

  const cancellable = useMemo(() => {
    const createDay = new Date(coupon.created_at);
    const now = new Date();
    const diffAsDays = differenceInHours(now, createDay) / 24;
    return giftishowInfo?.pinStatusCd == "01" && diffAsDays < 3;
  }, [giftishowInfo]);

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

  async function handleCancelClick(): Promise<void> {
    const isOk = await showAlertDialog({
      title: "기프티콘 취소",
      body: "기프티콘 사용을 취소하시겠어요? 기프티콘 교환에 썼던 포인트는 환불돼요.",
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    try {
      setIsCancelling(true);
      await GifticonCouponApi.cancel(coupon.id);

      const { data: fetchedInfo } = await UserApi.getMe();
      userAct.patchData({ me: fetchedInfo });
      setIsCancelling(false);
      init(); // reload status
      await showAlertDialog({
        title: "기프티콘 취소 완료",
        body: "기프티콘이 취소되었어요.",
        useOk: true,
      });
    } catch (e) {
      console.warn(e);
      setIsCancelling(false);
      enqueueSnackbar("기프티콘 취소에 실패했어요.", { variant: "error" });
    }
  }

  return (
    <Col position='relative'>
      <img
        src={coupon.giftishow_data.couponImgUrl}
        alt={"giftishow-" + coupon.id}
        width='100%'
        style={{
          margin: "auto",
          maxWidth: "300px",
          objectFit: "contain",
        }}
      />

      <Gap y={2} />

      <Row>
        <Txt
          color='primary.main'
          fontWeight={700}
        >
          교환 날짜: {dfFormat(new Date(coupon.created_at), "yy/MM/dd")}
        </Txt>
        <Expand />
        {cancellable ? (
          <Button
            variant='contained'
            size='small'
            sx={{ borderRadius: 4 }}
            disabled={isCancelling}
            onClick={handleCancelClick}
          >
            {isCancelling ? <CircularProgress size='1.5rem' /> : "취소하기"}
          </Button>
        ) : (
          <Box maxWidth='100px'>
            <Txt
              color='vague.main'
              variant='body3'
            >
              *취소는 구매 후 3일 이내에 가능합니다.
            </Txt>
          </Box>
        )}
      </Row>

      <Row justifyContent='flex-end'>
        {giftishowInfo && giftishowInfo.pinStatusCd !== "01" && (
          <Box m={2}>
            <Txt
              color='#ff0000'
              fontWeight={700}
            >
              {giftishowInfo.pinStatusNm}
            </Txt>
          </Box>
        )}
      </Row>

      <Gap y={2} />

      <Txt
        whiteSpace='pre-wrap'
        variant='body2'
        color='vague.main'
      >
        {coupon.product?.data.content}
      </Txt>

      {/* absolute position loading spinner */}
      {status == "loading" && (
        <Box
          position='absolute'
          left='50%'
          top='50%'
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Col>
  );
}
