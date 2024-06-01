import React, { useRef, useEffect } from "react";
import { Box, BoxProps } from "@mui/material";

interface DndBoxProps extends BoxProps {
  onReceiveFiles: (files: FileList) => void;
  setIsDragging: (isDragging: boolean) => void;
}

export function DndBox(props: DndBoxProps): JSX.Element {
  const { onReceiveFiles, setIsDragging, ...boxProps } = props;

  const dndRef = useRef<HTMLDivElement | null>(null);

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
  }, [onReceiveFiles]);

  function _handleDragIn(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
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
    // console.log('drag over');
    setIsDragging(true);
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
      ref={dndRef}
      {...boxProps}
    />
  );
}
