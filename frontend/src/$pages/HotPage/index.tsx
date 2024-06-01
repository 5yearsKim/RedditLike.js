"use client";
import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Container, Row, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { HotIcon, RecentIcon } from "@/ui/icons";
import { useResponsive } from "@/hooks/Responsive";
import { MainWithPannels } from "@/components/MainWithPannels";
import { RecentPostList } from "@/$pages/FeedPage/RecentPostList";
import { SideBox } from "@/$pages/FeedPage/style";
import { RangeSelector, FromRangeT } from "@/components/RangeSelector";
import { HotPostList } from "./HotPostList";
// logic
import { atom, useRecoilState } from "recoil";
import { subDays, startOfHour } from "date-fns";

const fromAt_HotPage = atom<Date | undefined>({
  key: "fromAt_HotPage",
  default: startOfHour(subDays(new Date(), 1)),
});

export function HotPage(): ReactNode {
  const t = useTranslations("pages.HotPage");

  const initialFromAt = "1d";
  const [fromAt, setFromAt] = useRecoilState(fromAt_HotPage);

  function handleFromAtChange(newVal: Date | undefined): void {
    setFromAt(newVal);
  }


  const { downSm } = useResponsive();

  function renderContent(): JSX.Element {
    if (downSm) {
      return <HotPostList fromAt={fromAt} />;
    } else {
      return (
        <MainWithPannels
          main={<HotPostList fromAt={fromAt} />}
          gap={2}
          pannelGap={1}
          pannels={[
            <SideBox key='recent-post'>
              <Row
                ml={1}
                my={0.5}
              >
                <RecentIcon />
                <Gap x={1} />
                <Txt variant='h6'>{t("recentVisit")}</Txt>
              </Row>
              <RecentPostList key='recentPostList' />
            </SideBox>,
          ]}
        />
      );
    }
  }

  return (
    <Container rtlP>
      <Row>
        <HotIcon color='secondary' />
        <Gap x={1} />
        <Txt variant='h6'>{t("hotPosts")}</Txt>
        <Expand />
        <RangeSelector
          initialRange={initialFromAt as FromRangeT}
          onChange={handleFromAtChange}
        />
      </Row>

      <Gap y={2} />

      {renderContent()}
    </Container>
  );
}
