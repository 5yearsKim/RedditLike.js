import React, { useState, MouseEvent, Fragment } from "react";
import { useTranslations } from "next-intl";
import { Flag } from "@/components/Flag";
import { useUrlState } from "@/hooks/UrlState";
import { ArrowDropDownIcon } from "@/ui/icons";
import { Row, Col, Center } from "@/ui/layouts";
import { ButtonBase, Popover } from "@mui/material";
import type { FlagT } from "@/types/Flag";

type FlagSelectorProps = {
  boardId: idT;
  flags: FlagT[];
  selected: FlagT | null;
  onSelect: (flag: FlagT | null) => void;
};

export function FlagSelector({
  boardId,
  flags,
  selected,
  onSelect,
}: FlagSelectorProps): JSX.Element {
  const t = useTranslations("pages.BoardMainPage.FlagSelector");

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectorOpen, setSelectorOpen] = useUrlState<boolean>({
    key: "flagSelector",
    query2val: (query) => query === "true",
    val2query: (val) => val ? "true" : null,
    backOn: (val) => !val,
  });

  function handleButtonClick(e: MouseEvent<HTMLElement>): void {
    setAnchorEl(e.currentTarget);
    setSelectorOpen(true);
  }

  function handlePopoverClose(): void {
    setSelectorOpen(false);
  }

  function handleFlagSelect(flag: FlagT | null): void {
    onSelect(flag);
    setSelectorOpen(false);
  }

  const basicFlag = (
    <Flag
      flag={{
        board_id: boardId,
        label: t("all"),
        bg_color: "rgba(255, 255, 255, 1)",
      }}
    />
  );

  return (
    <>
      <Row
        position='relative'
        onClick={handleButtonClick}
      >
        <ButtonBase
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
        {selected ? <Flag flag={selected} /> : basicFlag}
        <ArrowDropDownIcon />
      </Row>
      <Popover
        open={selectorOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        disableScrollLock
        slotProps={{
          paper: {
            sx: { my: 1 },
          },
        }}
      >
        <Col
          width='100%'
          py={0.5}
          alignItems='center'
        >
          <Center
            width='100%'
            px={1}
            py={0.5}
            position='relative'
            onClick={(): void => handleFlagSelect(null)}
          >
            <ButtonBase
              sx={{
                px: 1,
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            />
            {basicFlag}
          </Center>
          {flags.map((flag) => {
            return (
              <Fragment key={flag.id}>
                <Center
                  width='100%'
                  px={1}
                  py={0.5}
                  position='relative'
                  onClick={(): void => handleFlagSelect(flag)}
                >
                  <ButtonBase
                    sx={{
                      px: 1,
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                  <Flag flag={flag} />
                </Center>
              </Fragment>
            );
          })}
        </Col>
      </Popover>
    </>
  );
}
