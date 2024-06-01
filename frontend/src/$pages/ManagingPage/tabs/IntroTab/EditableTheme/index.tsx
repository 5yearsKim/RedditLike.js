"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ThemeProvider, Switch, Fade, Collapse, Box, Button, Paper } from "@mui/material";
import { EditIcon, ArrowRightIcon } from "@/ui/icons";
import { Col, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ColorPicker } from "@/ui/tools/ColorPicker";
// logic
import { useState, useMemo, ChangeEvent, MouseEvent } from "react";
import { useTheme, createTheme } from "@mui/material/styles";

type EditableThemeProps = {
  themeActive: boolean;
  themeColor?: string;
  onUpdateActive: (isActive: boolean) => any;
  onUpdateColor: ( themeColor: string | null) => any;
};

export function EditableTheme({
  themeActive: initThemeActive,
  themeColor: initThemeColor,
  onUpdateActive,
  onUpdateColor,
}: EditableThemeProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.IntroTab.EditableTheme");

  const theme = useTheme();

  const [isActive, setIsActive] = useState<boolean>(initThemeActive);
  const [themeColor, setThemeColor] = useState<string>(initThemeColor ?? theme.palette.primary.main);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const submitDisable = !themeColor;

  const demoTheme = useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          primary: {
            main: themeColor,
            contrastText: theme.palette.getContrastText(themeColor),
          },
        },
      }),
    [themeColor],
  );

  function handleIsActiveChange(e: ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    if (!checked) {
      onUpdateActive(false);
      setIsActive(false);
      setEditorOpen(false);
    } else {
      setThemeColor(initThemeColor ?? theme.palette.primary.main);
      onUpdateActive(true);
      setIsActive(true);
    }
  }

  function handleEditButtonClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setEditorOpen(true);
  }


  function handleThemeColorChange(color: string): void {
    setThemeColor(color);
  }

  function handleEditorCancelClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setEditorOpen(false);
  }

  async function handleEditorApplyClick(e: MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    await onUpdateColor(themeColor);
    setEditorOpen(false);
  }


  return (
    <Col>
      <Row justifyContent='space-around'>
        <Txt variant='subtitle1'>{t("useThemeColor")}</Txt>
        <Row>
          <Switch
            checked={isActive}
            onChange={handleIsActiveChange}
          />
          <Fade in={isActive}>
            <Button
              variant='contained'
              startIcon={<EditIcon />}
              onClick={handleEditButtonClick}
              disabled={editorOpen}
            >
              {t("editThemeColor")}
            </Button>
          </Fade>
        </Row>
      </Row>
      <Gap y={1} />
      {/* edit button */}
      {/* theme editor */}
      <Collapse in={editorOpen}>
        <Paper
          sx={{
            borderRadius: 1,
            maxWidth: "400px",
            margin: "auto",
            padding: "8px",
            bgcolor: "paper.main",
          }}
        >
          <Row
            justifyContent='space-around'
            maxWidth='250px'
            margin='auto'
          >
            <Button
              variant='contained'
              size='small'
            >
              {t("prevColor")}
            </Button>
            <ArrowRightIcon />
            <ThemeProvider theme={demoTheme}>
              <Button
                variant='contained'
                size='small'
              >
                {t("newColor")}
              </Button>
            </ThemeProvider>
          </Row>

          <Gap y={1} />

          <Row justifyContent='space-around'>
            <Box width='100px'>
              <Txt variant='body1' fontWeight={500}>{t("themeColor")}</Txt>
            </Box>
            <ColorPicker
              color={themeColor}
              onColorChange={handleThemeColorChange}
            />
          </Row>

          <Gap y={1} />

          <Row justifyContent='flex-end'>
            <Button
              variant='text'
              size='small'
              onClick={handleEditorCancelClick}
            >
              {t("cancel")}
            </Button>
            <Button
              variant='contained'
              size='small'
              disabled={submitDisable}
              onClick={handleEditorApplyClick}
            >
              {t("apply")}
            </Button>
          </Row>
        </Paper>
      </Collapse>
    </Col>
  );
}
