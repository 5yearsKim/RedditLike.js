import React, { Fragment, useEffect } from "react";
import { InitBox, LoadingIndicator, ErrorBox } from "@/components/$statusTools";
import { ListView, AppendLoading, AppendError } from "@/ui/tools/ListView";
import { Col, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CalendarIcon } from "@/ui/icons";
import { PointEventItem } from "@/components/PointEventItem";
import { parse as dfParse, format as dfFormat } from "date-fns";

// logic
import { useListData } from "@/hooks/ListData";
import * as PointEventApi from "@/apis/point_events";
import type { UserT, ListPointEventOptionT } from "@/types";


type PointEventListProps = {
  me: UserT;
  date?: string;
  showDate?: boolean;
};

export function PointEventList({
  me,
  date,
  showDate,
}: PointEventListProps): JSX.Element {

  const { data: pointEvents$, actions: pointEventsAct } = useListData({
    listFn: PointEventApi.list,
  });

  const listOpt: ListPointEventOptionT = {
    userId: me.id,
    date: date,
    $post: true,
  };
  useEffect(() => {
    pointEventsAct.load(listOpt);
  }, [me.id, date]);

  function handleErrorRetry(): void {
    pointEventsAct.load(listOpt, { force: true });
  }

  function handleLoaderDetect(): void {
    pointEventsAct.refill();
  }

  // view
  const { status, data: pointEvents, appendingStatus } = pointEvents$;

  if (status === "init") {
    return <InitBox />;
  }
  if (status === "loading") {
    return <LoadingIndicator />;
  }
  if (status == "error") {
    return <ErrorBox onRetry={handleErrorRetry} />;
  }

  if (pointEvents.length == 0) {
    return <Txt color='vague.main'>{date ? "해당 날에 집계된 포인트가 없어요." : "집계된 포인트가 없어요."}</Txt>;
  }
  return (
    <Col>
      <ListView
        data={pointEvents}
        onLoaderDetect={handleLoaderDetect}
        renderItem={(item, idx): JSX.Element => {
          return (
            <Fragment key={item.id}>
              {showDate && (idx == 0 || pointEvents[idx - 1].report_date !== item.report_date) && (
                <Row my={2}>
                  <CalendarIcon sx={{ color: "primary.main", fontSize: 22 }} />
                  <Gap x={1} />
                  <Txt
                    variant='subtitle2'
                    fontWeight={700}
                    color='primary.main'
                  >
                    {dfFormat(dfParse(item.report_date, "yyyy-MM-dd", new Date()), "yy년 M월 d일")}
                  </Txt>
                </Row>
              )}
              <PointEventItem pointEvent={item} />
            </Fragment>
          );
        }}
        renderAppend={(): JSX.Element => {
          if (appendingStatus == "loading") {
            return <AppendLoading />;
          }
          if (appendingStatus == "error") {
            return <AppendError onRetry={handleLoaderDetect} />;
          }
          return <></>;
        }}
      />
    </Col>
  );
}
