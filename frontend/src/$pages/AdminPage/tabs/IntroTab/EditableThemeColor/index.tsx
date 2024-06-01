import React from "react";
import { useTranslations } from "next-intl";
import { ThemeProvider, Collapse, Box, Button, Paper } from "@mui/material";
import { EditIcon, ArrowRightIcon } from "@/ui/icons";
import { Col, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ColorPicker } from "@/ui/tools/ColorPicker";
// logic
import { useState, useMemo, MouseEvent } from "react";
import { useTheme, createTheme } from "@mui/material/styles";

type EditableThemeColorProps = {
  themeColor?: string;
  onUpdateColor: ( themeColor: string | null) => any;
};

export function EditableThemeColor({
  themeColor: initThemeColor,
  onUpdateColor,
}: EditableThemeColorProps): JSX.Element {
  const t = useTranslations("pages.AdminPage.IntroTab.EditableThemeColor");

  const theme = useTheme();

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
      <Row>
        <Box
          width={30}
          height={30}
          borderRadius={1}
          bgcolor={theme.palette.primary.main}
        />
        <Gap x={2}/>
        <Button
          variant='contained'
          size='small'
          startIcon={<EditIcon />}
          onClick={handleEditButtonClick}
          disabled={editorOpen}
          sx={{ borderRadius: 4 }}
        >
          {t("editThemeColor")}
        </Button>
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
