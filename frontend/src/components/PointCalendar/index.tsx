import React from "react";
import { startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { Box, Grid, IconButton } from "@mui/material";
import { GridItem, Row, Col } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ArrowLeftIcon, ArrowRightIcon } from "@/ui/icons";

const weeks = ["일", "월", "화", "수", "목", "금", "토"];

type PointCalendarProps = {
  year: number;
  month: number;
  renderCell?: (year: number, month: number, day: number) => JSX.Element;
  onCalendarChange: (year: number, month: number) => void;
};

export function PointCalendar(props: PointCalendarProps): JSX.Element {
  const { year, month, renderCell, onCalendarChange } = props;

  const startDate = startOfMonth(new Date(year, month - 1, 15));
  const endDate = endOfMonth(new Date(year, month - 1, 15));
  const numDays = differenceInDays(endDate, startDate) + 1;

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  function onMonthLeftClick(): void {
    let newYear = year;
    let newMonth = month;
    if (month <= 1) {
      newYear = newYear - 1;
      newMonth = 12;
    } else {
      newMonth = newMonth - 1;
    }
    onCalendarChange(newYear, newMonth);
  }

  function onMonthRightClick(): void {
    let newYear = year;
    let newMonth = month;
    if (month >= 12) {
      newYear = newYear + 1;
      newMonth = 1;
    } else {
      newMonth = newMonth + 1;
    }
    onCalendarChange(newYear, newMonth);
  }

  return (
    <Col>
      <Row justifyContent='center'>
        <Box>
          <Txt
            variant='body2'
            fontWeight={700}
          >
            {year}년
          </Txt>
        </Box>
        <IconButton onClick={onMonthLeftClick}>
          <ArrowLeftIcon />
        </IconButton>

        <Txt
          variant='subtitle1'
          fontWeight={700}
        >
          {month}월
        </Txt>

        <IconButton onClick={onMonthRightClick}>
          <ArrowRightIcon />
        </IconButton>

        <Box
          width={60}
          height={10}
        />
      </Row>
      <Grid
        container
        columns={7}
      >
        {weeks.map((week) => (
          <GridItem
            key={week}
            xs={1}
          >
            <span>{week}</span>
          </GridItem>
        ))}

        {Array.from({ length: prefixDays }).map((_, idx) => (
          <GridItem
            key={idx}
            xs={1}
          ></GridItem>
        ))}

        {Array.from({ length: numDays }).map((_, idx) => {
          const date = idx + 1;
          // const isCurrentDate = date === value.getDate();

          return (
            <GridItem
              key={date}
              xs={1}
            >
              {renderCell ? renderCell(year, month, date) : <Txt>{date}</Txt>}
            </GridItem>
          );
        })}

        {Array.from({ length: suffixDays }).map((_, idx) => (
          <GridItem
            key={idx}
            xs={1}
          ></GridItem>
        ))}
      </Grid>
    </Col>
  );
}
