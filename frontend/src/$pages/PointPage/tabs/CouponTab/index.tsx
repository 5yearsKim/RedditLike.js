"use client";
import React from "react";
import { Dialog, Button, Box, IconButton, Checkbox } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { Container, Col, Row, Gap, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { SlideTransition } from "@/ui/tools/SlideTransition";
import { CloseIcon, RetryIcon } from "@/ui/icons";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { ListView } from "@/ui/tools/ListView";
import { ScrollTopButton } from "@/ui/tools/ScrollTopButton";
import { MyPoint } from "../../items/MyPoint";
import { GifticonCouponDetail } from "./GifticonCouponDetail";
import { GifticonCouponItem } from "./GifticonCouponItem";
// logic
import { ChangeEvent, useEffect, useState } from "react";
import { useListData } from "@/hooks/ListData";
import * as GifticonCouponApi from "@/apis/gifticon_coupons";
import type { UserT, GifticonCouponT, ListGifticonCouponOptionT } from "@/types";

type CouponTabProps = {
  me: UserT;
};

export function CouponTab({
  me,
}: CouponTabProps): JSX.Element {

  const [selectedCoupon, setSelectedCoupon] = useState<GifticonCouponT | null>(null);
  const [isOnlyUsable, setIsOnlyUsable] = useState<boolean>(true);

  const { data: gifticonCoupons$, actions: gifticonCouponsAct } = useListData({
    listFn: GifticonCouponApi.list,
  });

  const listOpt: ListGifticonCouponOptionT = {
    userId: me.id,
    $product: true,
    usable: isOnlyUsable ? "only" : undefined,
    limit: 10,
  };
  useEffect(() => {
    gifticonCouponsAct.load(listOpt);
  }, [me.id, isOnlyUsable]);

  // TODO
  // usePreventBack([
  //   {
  //     condition: Boolean(selectedCoupon),
  //     logic: (): void => setSelectedCoupon(null),
  //   },
  // ]);

  function handleErrorRetry(): void {
    gifticonCouponsAct.load(listOpt, { force: true });
  }

  function handleLoaderDetect(): void {
    gifticonCouponsAct.refill();
  }

  function handleGifticonCouponClick(coupon: GifticonCouponT): void {
    setSelectedCoupon(coupon);
  }

  function handleCouponDialogClose(): void {
    setSelectedCoupon(null);
  }

  function handleRefreshClick(): void {
    gifticonCouponsAct.load(listOpt, { force: true });
  }

  function handleIsOnlyUsableChange(e: ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    setIsOnlyUsable(checked);
  }


  const { status, data: gifticonCoupons } = gifticonCoupons$;

  const { downSm } = useResponsive();

  if (status == "init") {
    return <InitBox />;
  }
  if (status == "loading") {
    return <LoadingBox height='60vh' />;
  }
  if (status == "error") {
    return (
      <ErrorBox
        height='60vh'
        onRetry={handleErrorRetry}
      />
    );
  }

  return (
    <Container
      rtlP
      maxWidth='sm'
    >
      <Row>
        <Txt variant='h5'>내 기프티콘</Txt>
        <IconButton
          size='small'
          onClick={handleRefreshClick}
        >
          <RetryIcon />
        </IconButton>

        <Expand />

        <MyPoint point={me.points} />
      </Row>

      <Row justifyContent='flex-end'>
        <Row>
          <Txt
            variant='body2'
            color='vague.main'
          >
            사용 가능만
          </Txt>
          <Checkbox
            checked={isOnlyUsable}
            onChange={handleIsOnlyUsableChange}
          />
        </Row>
      </Row>

      <Gap y={2} />

      {gifticonCoupons.length == 0 && (
        <>
          {isOnlyUsable ? (
            <Txt color='vague.main'>사용 가능한 기프티콘이 없어요.</Txt>
          ) : (
            <Txt color='vague.main'>교환한 기프티콘이 없어요.</Txt>
          )}
        </>
      )}

      <Col>
        <ListView
          data={gifticonCoupons}
          renderItem={(item): JSX.Element => {
            return (
              <Box mb={2}>
                <GifticonCouponItem
                  gifticonCoupon={item}
                  onClick={(): void => handleGifticonCouponClick(item)}
                />
              </Box>
            );
          }}
          onLoaderDetect={handleLoaderDetect}
        />
      </Col>

      <Box
        position='fixed'
        right={18}
        bottom={20}
      >
        <ScrollTopButton size={downSm ? "small" : "medium"} />
      </Box>

      <Dialog
        open={Boolean(selectedCoupon)}
        onClose={handleCouponDialogClose}
        maxWidth='sm'
        fullWidth
        fullScreen={downSm}
        TransitionComponent={SlideTransition}
      >
        {selectedCoupon && (
          <Box p={{ xs: 2, sm: 4 }}>
            <GifticonCouponDetail gifticonCoupon={selectedCoupon} />
          </Box>
        )}
        {downSm && (
          <>
            <Gap y={8} />
            <Box
              position='fixed'
              bottom={0}
              width='100%'
              bgcolor='rgba(255, 255, 255, 0.7)'
            >
              <Button
                fullWidth
                startIcon={<CloseIcon />}
                size='large'
                onClick={handleCouponDialogClose}
              >
                닫기
              </Button>
            </Box>
          </>
        )}
      </Dialog>
    </Container>
  );
}
