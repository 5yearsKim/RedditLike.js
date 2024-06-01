import React, { useEffect, useState, useMemo, Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useResponsive } from "@/hooks/Responsive";
import { Button, Box, Dialog, Checkbox } from "@mui/material";
import { FlagIcon } from "@/ui/icons";
import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Flag } from "@/components/Flag";
import { useBoardMain$ } from "@/stores/BoardMainStore";
import type { BoardT, FlagT } from "@/types";

export type FlagSelectorProps = {
  isManager: boolean;
  board: BoardT;
  flags: FlagT[];
  onChange: (flags: FlagT[]) => void;
};

export function FlagSelector({
  isManager,
  board,
  flags,
  onChange,
}:FlagSelectorProps): ReactNode {
  const t = useTranslations("components.PostEditor.FlagSelector");

  const { downSm } = useResponsive();
  const boardMain$ = useBoardMain$();

  const cands = useMemo<FlagT[]>(() => {
    if (boardMain$.data?.board.id !== board.id) {
      return [];
    }
    const allFlags = boardMain$.data?.flags ?? [];
    if (isManager) {
      return allFlags;
    } else {
      return allFlags.filter((item) => item.manager_only !== true);
    }
  }, [boardMain$.data?.board.id, isManager]);
  // const candStatus: any = "loaded";
  // const cands: FlagT[] = [];

  const [selected, setSelected] = useState<FlagT[]>(flags ?? []);
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectorOpen) {
      // flagsAct.init(listOpt);
      setSelected(flags);
    }
  }, [selectorOpen]);

  function handleButtonClick(): void {
    setSelectorOpen(true);
  }

  function handleFlagClick(flag: FlagT): void {
    const idx = selected.findIndex((item) => item.id == flag.id);
    if (idx < 0) {
      if (board?.allow_multiple_flag) {
        const newSelected = [...selected, flag];
        setSelected(newSelected);
      } else {
        setSelected([flag]);
      }
    } else {
      const newSelected = [...selected];
      newSelected.splice(idx, 1);
      setSelected(newSelected);
    }
  }

  function handleSelectorClose(): void {
    setSelectorOpen(false);
  }

  function handleApplyClick(): void {
    onChange(selected);
    setSelectorOpen(false);
  }

  return (
    <Fragment>
      {selected.length ? (
        <Box
          sx={{ cursor: "pointer" }}
          onClick={handleButtonClick}
        >
          <Row columnGap={0.5}>
            {selected.map((flag) => {
              return (
                <Flag
                  key={flag.id}
                  flag={flag}
                />
              );
            })}
          </Row>
        </Box>
      ) : (
        <Button
          variant={board.force_flag ? "contained" : "outlined"}
          onClick={handleButtonClick}
          startIcon={<FlagIcon />}
          size={downSm ? "small" : "medium"}
          sx={{
            minWidth: downSm ? 80 : undefined,
            borderRadius: 4,
            whiteSpace: "pre",
          }}
        >
          {downSm ? t("flag") : t("selectFlag")}
        </Button>
      )}
      <Dialog
        open={selectorOpen}
        onClose={handleSelectorClose}
        // hideBackdrop
      >
        <Box p={2}>
          <Row justifyContent='flex-end'>
            {board?.allow_multiple_flag && (
              <Txt
                color='vague.main'
                variant='subtitle2'
              >
                *{t("allowMultiple")}
              </Txt>
            )}
          </Row>
          <Col>
            {cands.map((cand) => {
              const idx = selected.findIndex((item) => item.id == cand.id);
              const checked = idx >= 0;
              return (
                <Row
                  key={cand.id}
                  onClick={(e): void => {
                    e.preventDefault();
                    handleFlagClick(cand);
                  }}
                >
                  <Checkbox checked={checked} />
                  <Gap x={2} />
                  <Box minWidth='100px'>
                    <Flag
                      flag={cand}
                      showTip
                    />
                  </Box>
                </Row>
              );
            })}
          </Col>

          <Gap y={2} />

          <Row justifyContent='flex-end'>
            <Button onClick={handleSelectorClose}>
              {t("cancel")}
            </Button>
            <Button
              variant='contained'
              onClick={handleApplyClick}
            >
              {t("apply")}
            </Button>
          </Row>
        </Box>
      </Dialog>
    </Fragment>
  );
}
