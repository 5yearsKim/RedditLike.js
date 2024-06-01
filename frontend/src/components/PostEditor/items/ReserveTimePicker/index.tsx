import React from "react";
import { useTranslations } from "next-intl";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { IconButton } from "@mui/material";
import { Tooltip } from "@/ui/tools/Tooltip";
import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CloseIcon } from "@/ui/icons";
import { isBefore } from "date-fns";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";

type ReserveTimePickerProps = {
  reservedAt: Date | null;
  onChange: (val: Date | null) => void;
};

export function ReserveTimePicker({
  reservedAt,
  onChange,
}: ReserveTimePickerProps): JSX.Element {
  const t = useTranslations("components.PostEditor.ReserveTimePicker");

  function handleReservedAtChange(newVal: Date | null): void {
    onChange(newVal);
  }

  return (
    <Col alignItems='center'>
      <Row>
        <Txt
          variant='body2'
          fontWeight={700}
        >
          {t("reserveAt")}
        </Txt>
        <Gap x={1} />
        <HelperTooltip tip={t("reserveAtHelper")}/>
      </Row>

      <Gap y={1} />

      <Row>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label={t('reservedAt')}
            value={reservedAt ?? null}
            slotProps={{
              textField: { variant: "standard" },
            }}
            shouldDisableDate={(day): boolean => isBefore(day, new Date())}
            onChange={handleReservedAtChange}
            // renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        {reservedAt !== null && (
          <Tooltip title={t("cancelReserve")}>
            <IconButton
              disabled={reservedAt == null}
              onClick={(): void => handleReservedAtChange(null)}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        )}
      </Row>
    </Col>
  );
}
