import React from "react";
import { useTranslations } from "next-intl";
import { Popover, Button } from "@mui/material";
import { ChromePicker, GithubPicker, type ColorResult } from "react-color";
import { Row } from "@/ui/layouts";
import { PaletteOlIcon } from "@/ui/icons";
import { ColoredBox } from "./style";
// logic
import { useState, useEffect, MouseEvent } from "react";
import { PopoverOrigin } from "@mui/material";

type ColorPickerProps = {
  color?: string;
  onColorChange: (color: string) => void;
  origin?: PopoverOrigin;
};

export function ColorPicker({
  color,
  origin,
  onColorChange,
}: ColorPickerProps): JSX.Element {
  const t = useTranslations("ui.tools.ColorPicker");

  const [isDetail, setIsDetail] = useState<boolean>(false);
  const [pickerEl, setPickerEl] = useState<HTMLDivElement | null>(null);

  const pickerOpen = Boolean(pickerEl);

  // reset isDetail
  useEffect(() => {
    if (pickerOpen) {
      setIsDetail(false);
    }
  }, [pickerOpen]);

  function handleColorButtonClick(e: MouseEvent<HTMLDivElement>): void {
    setPickerEl(e.currentTarget);
  }

  function handleDetailClick(): void {
    setIsDetail(true);
  }

  function handleColorChange(result: ColorResult): void {
    onColorChange(result.hex);
  }

  function handleColorPopoverClose(): void {
    setPickerEl(null);
  }

  return (
    <>
      <ColoredBox
        color={color}
        onClick={handleColorButtonClick}
      />
      <Popover
        elevation={5}
        open={pickerOpen}
        anchorEl={pickerEl}
        onClose={handleColorPopoverClose}
        anchorOrigin={
          origin ?? {
            vertical: "bottom",
            horizontal: "left",
          }
        }
      >
        {isDetail ? (
          <ChromePicker
            color={color}
            disableAlpha
            onChange={handleColorChange}
          />
        ) : (
          <>
            <GithubPicker
              color={color}
              triangle='hide'
              onChange={handleColorChange}
            />
            <Row justifyContent='flex-end'>
              <Button
                size='small'
                startIcon={<PaletteOlIcon />}
                onClick={handleDetailClick}
              >
                {t("moreColors")}
              </Button>
            </Row>
          </>
        )}
      </Popover>
    </>
  );
}
