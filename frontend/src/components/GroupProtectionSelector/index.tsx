import React, { useState, useEffect, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EditIcon } from "@/ui/icons";
import {
  IconButton, Dialog, Button,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
} from "@mui/material";
import type { GroupProtectionT } from "@/types";

import { useGroupProtectionMap } from "./data";


type GroupProtectionSelectorProps = {
  value: GroupProtectionT;
  onSelect: (val: GroupProtectionT) => void|Promise<void>;
}

export function GroupProtectionSelector({
  value,
  onSelect,
}: GroupProtectionSelectorProps) {
  const t = useTranslations("components.GroupProtectionSelector");
  const groupProtectionMap = useGroupProtectionMap();

  const info = groupProtectionMap[value];
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<GroupProtectionT>(value);

  useEffect(() => {
    if (selectorOpen) {
      setSelected(value);
    }
  }, [selectorOpen]);

  function handleEditButtonClick(): void {
    setSelectorOpen(true);
  }

  function handleSelectorClose(): void {
    setSelectorOpen(false);
  }

  const handleSelectedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = (e.target as HTMLInputElement).value as any;
    setSelected(newVal);
  };

  async function handleApply(): Promise<void> {
    onSelect(selected);
    setSelectorOpen(false);
  }

  return (
    <>
      <Row>
        <Txt>{info.name}</Txt>
        <IconButton onClick={handleEditButtonClick}>
          <EditIcon/>
        </IconButton>
      </Row>
      <Dialog open={selectorOpen} onClose={handleSelectorClose}>
        <Col
          px={2}
          py={1}
          minWidth={300}
          maxWidth={600}
          alignItems='center'
        >
          <FormControl>
            <FormLabel>{t("groupProtectionRange")}</FormLabel>
            <Gap y={1}/>
            <RadioGroup
              value={selected}
              onChange={handleSelectedChange}
            >
              {(["public", "protected", "private"] as GroupProtectionT[]).map((key) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  label={
                    <Col my={1}>
                      <Txt fontWeight={700}>{groupProtectionMap[key].name}</Txt>
                      <Txt>{groupProtectionMap[key].helper}</Txt>
                    </Col>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Gap y={2}/>

          <Row width='100%' justifyContent='flex-end'>
            <Button onClick={handleSelectorClose}>
              {t("cancel")}
            </Button>
            <Button variant='contained' onClick={handleApply}>
              {t("apply")}
            </Button>
          </Row>
        </Col>
      </Dialog>
    </>
  );
}