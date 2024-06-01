import React from "react";
import Image from "next/image";
import { useResponsive } from "@/hooks/Responsive";
import { InitBox, ErrorBox, LoadingIndicator } from "@/components/$statusTools";
import { Container, Row, Center, Gap, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CalendarIcon } from "@/ui/icons";
import { Box, ButtonBase, Button } from "@mui/material";
import { red } from "@mui/material/colors";
import { PointCalendar } from "@/components/PointCalendar";
import { ScrollTopButton } from "@/ui/tools/ScrollTopButton";
import { MyPoint } from "../../items/MyPoint";
import { PointEventList } from "./PointEventList";
import { PointHelperIcon } from "./PointHelperIcon";
// logic
import { useEffect, useState, useMemo } from "react";
import { usePointReportsStore } from "@/stores/PointReportsStore";
import * as PointReportApi from "@/apis/point_reports";
import { parse as dfParse, format as dfFormat, getYear, getMonth, endOfMonth } from "date-fns";
import type { UserT, ListPointReportOptionT, PointReportT } from "@/types";

type ReportTabProps = {
  me: UserT;
};

export function ReportTab({ me }: ReportTabProps): JSX.Element {

  const todayStr = useMemo(() => dfFormat(new Date(), "yyyy-MM-dd"), []);
  const { pointReports$, pointReportsAct } = usePointReportsStore();
  const [calendar, setCalendar] = useState<{ year: number; month: number }>({
    year: getYear(new Date()),
    month: getMonth(new Date()) + 1,
  });
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);


  // const todayNewPoints = selectedDate ? 0 :
  //   pointReports$.data.filter((item) => !item.is_checked).map((item) => item.total_points).reduce((a, b) => a + b, 0);

  const startOfMonth = new Date(calendar.year, calendar.month - 1, 1);
  const listOpt: ListPointReportOptionT = {
    userId: me.id,
    limit: 31,
    fromDate: dfFormat(startOfMonth, "yyyy-MM-dd"),
    untilDate: dfFormat(endOfMonth(startOfMonth), "yyyy-MM-dd"),
  };
  useEffect(() => {
    pointReportsAct.load(listOpt);
  }, [calendar]);

  useEffect(() => {
    return () => {
      _checkAllReport();
    };
  }, []);

  function handleErrorRetry(): void {
    pointReportsAct.load(listOpt, { force: true });
  }

  function handleCalendarChange(year: number, month: number): void {
    setCalendar({ year, month });
  }

  function handleSelectedDateChange(dateStr: string | undefined): void {
    setSelectedDate(dateStr);

    const reportFound = pointReports$.data.find((item) => item.report_date == dateStr);
    if (!reportFound) {
      return;
    }
  }

  async function _checkAllReport(): Promise<void> {
    try {
      await PointReportApi.checkAll();
      const newReports = pointReports$.data.map((item) => {
        if (item.is_checked) {
          return item;
        } else {
          return { ...item, is_checked: true };
        }
      });
      pointReportsAct.patch({ data: newReports });
    } catch (e) {
      console.warn(e);
    }
  }


  const { status, data: pointReports } = pointReports$;
  const { downSm } = useResponsive();

  const reportsMap = useMemo(() => {
    return pointReports.reduce((map, item) => {
      map.set(item.report_date, item);
      return map;
    }, new Map<string, PointReportT>());
  }, [pointReports]);

  function renderCalendarCell(year: number, month: number, day: number): JSX.Element {
    const date = new Date(year, month - 1, day, 0, 0);
    const dateStr = dfFormat(date, "yyyy-MM-dd");
    // console.log(year, month, day, dateStr)
    const matchedReport = reportsMap.get(dateStr);

    const isToday = todayStr == dateStr;
    const isOver = todayStr < dateStr;
    const isSelected = dateStr == selectedDate;

    const [cellW, cellH] = [60, 40];
    const circleW = 32;

    if (isOver) {
      return (
        <Center
          width={cellW}
          height={cellH}
        >
          <Txt color='vague.light'>{day}</Txt>
        </Center>
      );
    }

    if (isToday) {
      return (
        <Center
          width={cellW}
          height={cellH}
        >
          <Box
            borderRadius={50}
            border={1}
            display='flex'
            overflow='hidden'
            sx={{
              bgcolor: isSelected ? "primary.main" : undefined,
              border: 1,
              // borderColor: blue[400],
              borderColor: "primary.main",
            }}
          >
            <ButtonBase
              sx={{ width: circleW, height: circleW }}
              onClick={(): void => handleSelectedDateChange(todayStr)}
            >
              <Txt color={isSelected ? "#ffffff" : "vague.light"}>{day}</Txt>
            </ButtonBase>
          </Box>
        </Center>
      );
    }

    return (
      <Center
        width={cellW}
        height={cellH}
        position='relative'
        m={"1px"}
      >
        <Box
          borderRadius={50}
          overflow='hidden'
          sx={{
            bgcolor: isSelected ? "primary.main" : undefined,
          }}
        >
          {matchedReport && (
            <Box
              position='absolute'
              bottom={-10}
              left={"50%"}
              sx={{
                whiteSpace: "nowrap",
                transform: "translate(-50%, 0%)",
              }}
            >
              <Txt
                variant='body3'
                color='#ff0000'
              >
                +{matchedReport.total_points.toLocaleString()} p
              </Txt>
            </Box>
          )}

          {matchedReport && !matchedReport.is_checked && (
            <Center
              position='absolute'
              top='20%'
              right='20%'
              bgcolor='secondary.main'
              fontSize={10}
              fontWeight={700}
              color='#fff'
              borderRadius={4}
              width={12}
              height={12}
            >
              N
            </Center>
          )}

          <ButtonBase
            disabled={isOver}
            onClick={(): void => handleSelectedDateChange(dateStr)}
            sx={{ width: circleW, height: circleW, position: "relative" }}
          >
            <Txt color={isSelected ? "#ffffff" : undefined}>{day}</Txt>
          </ButtonBase>
        </Box>
      </Center>
    );
  }

  function renderCalendar(): JSX.Element {
    if (status == "init") {
      return <InitBox />;
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
      <Box position='relative'>
        <PointCalendar
          year={calendar.year}
          month={calendar.month}
          renderCell={renderCalendarCell}
          onCalendarChange={handleCalendarChange}
        />
        {status == "loading" && (
          <LoadingIndicator
            position='absolute'
            top='50%'
            left='50%'
            sx={{
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </Box>
    );
  }

  function renderEventsList(): JSX.Element {
    if (selectedDate == undefined) {
      return (
        <>
          <Row>
            <Image
              src='/images/point_coin.png'
              alt='coin-alt'
              width={20}
              height={20}
              style={{
                marginTop: 3,
              }}
            />
            <Gap x={1} />
            <Txt variant='h6'>최근 리워드 내역</Txt>
          </Row>

          <Gap y={1} />

          <PointEventList
            me={me}
            date={undefined}
            showDate
          />

          <Gap y={8} />
        </>
      );
    }
    return (
      <>
        <Row>
          <CalendarIcon sx={{ color: "primary.main", fontSize: 22 }} />
          <Gap x={1} />
          <Txt
            variant='subtitle2'
            fontWeight={700}
            color='primary.main'
          >
            {dfFormat(dfParse(selectedDate, "yyyy-MM-dd", new Date()), "yy년 M월 d일")}
          </Txt>

          {todayStr == selectedDate && (
            <Box mx={1}>
              <Txt
                variant='body2'
                fontWeight={700}
                sx={{ color: red[400] }}
              >
                TODAY
              </Txt>
            </Box>
          )}
          <Expand />
          <Button
            variant='outlined'
            onClick={(): void => handleSelectedDateChange(undefined)}
            size={downSm ? "small" : "medium"}
          >
            내역 모두보기
          </Button>
        </Row>

        <Gap y={2} />

        {selectedDate == todayStr ? (
          <Txt color='vague.main'>오늘은 집계중..</Txt>
        ) : (
          <PointEventList
            me={me}
            date={selectedDate}
          />
        )}
      </>
    );
  }

  return (
    <Container
      rtlP
      maxWidth='sm'
    >
      <Row>
        <Txt variant='h5'>리워드 리포트</Txt>
        <PointHelperIcon />
        <Expand />
        <MyPoint point={me.points} />
      </Row>

      <Gap y={1} />

      {renderCalendar()}

      <Gap y={4} />

      {renderEventsList()}

      <Box
        position='fixed'
        right={18}
        bottom={20}
      >
        <ScrollTopButton size={downSm ? "small" : "medium"} />
      </Box>

      {/* <PointCheckDialog newPoints={todayNewPoints + 100}/> */}
    </Container>
  );
}
