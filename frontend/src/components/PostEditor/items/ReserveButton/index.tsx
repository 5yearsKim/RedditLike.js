import React, { useState, ChangeEvent, ReactNode } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button } from "@mui/material";
import { Row, Col } from "@/ui/layouts";
import { isBefore } from "date-fns";
// logic
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import { addMinutes } from "date-fns";

const { persistAtom } = recoilPersist();

type ReserveButtonProps = {
  onSubmit: (val: Date) => void;
};

const reserveVarianceState = atom<number>({
  key: "reserveVarianceState",
  default: 0,
  effects: [persistAtom],
});


export function ReserveButton({
  onSubmit,
}: ReserveButtonProps): ReactNode {

  const [reservedAt, setReservedAt] = useState<null | Date>(null);
  const [reserveVariance, setReserveVariance] = useRecoilState(reserveVarianceState);

  const isValid = reservedAt && reservedAt > new Date();

  function handleChangeReservedAt(newVal: Date | null): void {
    if (newVal) {
      setReservedAt(newVal);
    }
  }

  function handleSubmit(): void {
    if (reservedAt) {
      onSubmit(reservedAt);
    }
  }

  function handleVarianceChange(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.value == "") {
      setReserveVariance(0);
    }
    const value = Number.parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      return;
    }
    setReserveVariance(value);
  }

  function handleRandomGenerate(): void {
    const randMin = Math.random() * reserveVariance;
    const targetDate = addMinutes(new Date(), randMin);
    setReservedAt(targetDate);
  }

  return (
    <Row>
      <Col>
        <input
          type='number'
          value={reserveVariance}
          onChange={handleVarianceChange}
        />
        <button onClick={handleRandomGenerate}>random</button>
      </Col>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label='예약 게시'
          value={reservedAt ?? null}
          shouldDisableDate={(day): boolean => isBefore(day, new Date())}
          onChange={handleChangeReservedAt}
          // renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button
        variant='contained'
        onClick={handleSubmit}
        disabled={!isValid}
      >
        예약 게시
      </Button>
    </Row>
  );
}
