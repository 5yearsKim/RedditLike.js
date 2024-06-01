"use client";
import React from "react";
import Image from "next/image";
import { useResponsive } from "@/hooks/Responsive";
import { Box, Button, CircularProgress, Collapse, useTheme, lighten } from "@mui/material";
import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { PointImage } from "@/ui/images";
// logic
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserActions } from "@/stores/UserStore";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import * as GifticonCouponApi from "@/apis/gifticon_coupons";
import * as UserApi from "@/apis/users";

// import { GifticonCouponS, UserInfoS } from "@/services";
import type { GifticonProductT } from "@/types";

type GifticonProductDetailProps = {
  userPoints: number;
  gifticonProduct: GifticonProductT;
};


export function GifticonProductDetail({
  userPoints,
  gifticonProduct,
}: GifticonProductDetailProps): JSX.Element {

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isExpandDetail, setIsExpandDetail] = useState<boolean>(false);
  const userAct = useUserActions();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();

  function handleExpandDetail(): void {
    setIsExpandDetail(true);
  }

  async function handlePurchaseClick(): Promise<void> {
    const isConfirmOk = await showAlertDialog({
      title: "기프티콘 교환",
      body: `${gifticonProduct.real_price} 포인트를 사용하여 '${gifticonProduct.product_name}' 기프티콘을 교환할까요?`,
      useOk: true,
      useCancel: true,
    });
    if (!isConfirmOk) {
      return;
    }
    try {
      setIsSubmitting(true);

      await GifticonCouponApi.issue(gifticonProduct.id);

      const { data: fetchedInfo } = await UserApi.getMe();
      userAct.patchData({ me: fetchedInfo });
      setIsSubmitting(false);
      const isOk = await showAlertDialog({
        title: "기프티콘 교환 완료",
        body: `내 포인트로 기프티콘 '${gifticonProduct.data.brandName}'을 교환했어요 :) 기프티콘을 확인하러 이동할까요?`,
        useOk: true,
        useCancel: true,
      });
      if (isOk) {
        router.replace("/points/coupon");
      }
    } catch (e) {
      console.warn(e);
      setIsSubmitting(false);
      enqueueSnackbar("기프티콘 구매에 실패했어요.", { variant: "error" });
    }
  }

  const { downSm } = useResponsive();
  const theme = useTheme();
  const gifticon = gifticonProduct;

  return (
    <Col>
      <Box
        position='relative'
        width='100%'
        maxWidth={400}
        sx={{ aspectRatio: 1 }}
        alignSelf='center'
      >
        <Image
          src={gifticon.data.goodsImgB}
          alt={gifticon.product_name}
          fill
        />
      </Box>

      <Col
        p={2}
        pb={{ xs: 2, sm: 1 }}
      >
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
        <Txt variant='h6'>{gifticon.product_name}</Txt>

        <Gap y={3} />

        <Box position='relative'>
          <Collapse
            in={isExpandDetail}
            collapsedSize={100}
          >
            <Txt whiteSpace='pre-line'>{gifticon.data.content}</Txt>
          </Collapse>
          {!isExpandDetail && (
            <Box
              position='absolute'
              width='100%'
              bottom={0}
              height='50px'
              sx={{
                background: `linear-gradient(transparent, ${lighten(theme.palette.paper.main, 0.19)})`,
              }}
            />
          )}
        </Box>
        <Row justifyContent='flex-end'>
          {!isExpandDetail && (
            <Button
              size='small'
              onClick={handleExpandDetail}
            >
              펼치기..
            </Button>
          )}
        </Row>

        <Gap y={1} />

        <Row justifyContent='flex-end'>
          <Txt
            variant='h5'
            fontWeight={500}
          >
            {gifticon.real_price.toLocaleString()}
          </Txt>
          <Box mr={0.75} />
          <PointImage fontSize={18} />
        </Row>

        <Gap y={2} />
        {userPoints < gifticon.real_price ? (
          <Button
            variant='contained'
            disabled
          >
            {downSm
              ? `총 ${gifticon.real_price.toLocaleString()} 포인트가 필요해요.`
              : `교환하려면 총 ${gifticon.real_price.toLocaleString()} 포인트가 필요해요.`}
          </Button>
        ) : (
          <Button
            variant='contained'
            disabled={isSubmitting}
            onClick={handlePurchaseClick}
          >
            {isSubmitting ? (
              <CircularProgress size='1.5rem' />
            ) : (
              `${gifticon.real_price.toLocaleString()} 포인트로 교환하기`
            )}
          </Button>
        )}
      </Col>
    </Col>
  );
}
