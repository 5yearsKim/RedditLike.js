"use client";
import React, { useRef, useEffect, useState, ChangeEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

type EmptyMediaEditorProps = {
  label?: string;
  acceptFormat?: string;
  multiple?: boolean;
  onReceiveFiles: (data: FileList) => void;
};

export function EmptyMediaEditor({
  label,
  acceptFormat,
  multiple,
  onReceiveFiles,
}: EmptyMediaEditorProps): ReactNode {
  const t = useTranslations("components.PostEditor.EmptyMediaEditor");

  const theme = useTheme();

  const dndRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (dndRef.current !== null) {
      dndRef.current.addEventListener("dragenter", _handleDragIn);
      dndRef.current.addEventListener("dragleave", _handleDragOut);
      dndRef.current.addEventListener("dragover", _handleDragOver);
      dndRef.current.addEventListener("drop", _handleDrop);
    }
    return (): void => {
      if (dndRef.current !== null) {
        dndRef.current.removeEventListener("dragenter", _handleDragIn);
        dndRef.current.removeEventListener("dragleave", _handleDragOut);
        dndRef.current.removeEventListener("dragover", _handleDragOver);
        dndRef.current.removeEventListener("drop", _handleDrop);
      }
    };
  }, []);

  function handleUploadChange(e: ChangeEvent<HTMLInputElement>): void {
    const files = e.target.files;
    if (files) {
      onReceiveFiles(files);
    }
  }

  function _handleDragIn(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    // console.log('drag in');
  }

  function _handleDragOut(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    // console.log('drag out');
    setIsDragging(false);
  }

  function _handleDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }

  function _handleDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files) {
      onReceiveFiles(files);
    }
  }

  return (
    <Box
      minHeight='280px'
      display='flex'
      ref={dndRef}
      sx={{
        border: isDragging ? `dashed 2px ${theme.palette.primary.main}` : `dashed 1px ${theme.palette.vague.main}`,
      }}
    >
      <Box margin='auto'>
        <Row>
          <Txt
            color='vague.main'
            variant='subtitle1'
          >
            {label ?? t("dragAndDropOr")}
          </Txt>
          <Gap x={1} />
          <Button
            variant='contained'
            component='label' //https://mui.com/material-ui/react-button/
          >
            {t("upload")}
            <input
              hidden
              accept={acceptFormat}
              multiple={multiple}
              type='file'
              onChange={handleUploadChange}
            />
          </Button>
        </Row>
      </Box>
    </Box>
  );
}
