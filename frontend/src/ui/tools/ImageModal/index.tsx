"use client";
import React, { useState, useRef, MouseEvent, TouchEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Dialog, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { CloseIcon, DownloadIcon, PhotoOlIcon, PhotoLibraryOlIcon } from "@/ui/icons";
import { ImageSlider, type ImageSliderT } from "@/ui/tools/ImageSlider";

type ImageModalProps = {
  open: boolean;
  initialIdx?: number;
  images: string[];
  onClose: () => void;
};

export function ImageModal({
  open,
  initialIdx,
  images,
  onClose,
}: ImageModalProps): ReactNode {
  const t = useTranslations("ui.tools.ImageModal");

  const { downSm } = useResponsive();
  const [downloadPopupEl, setDownloadPopupEl] = useState<HTMLElement | null>(null);
  const sliderRef = useRef<ImageSliderT | null>(null);
  const [tStart, setTStart] = useState<Touch | null>(null); // touch start

  function handleTouchStart(e: TouchEvent): void {
    const touches = e.targetTouches;
    if (touches.length !== 1) {
      setTStart(null);
      return;
    }
    setTStart(touches[0] as any);
  }

  function handleTouchEnd(e: TouchEvent): void {
    const touches = e.changedTouches;
    const scale = sliderRef.current!.getScale();
    if (scale > 1.2) {
      return;
    }
    if (touches.length !== 1 || !tStart) {
      setTStart(null);
      return;
    }
    const end = touches[0];
    const diffY = end.clientY - tStart.clientY;
    const diffX = end.clientX - tStart.clientX;

    // console.log('diffY', diffY);
    // console.log('diffX', diffX);

    if (diffY > 100 && Math.abs(diffY / (Math.abs(diffX) + 1)) > 2) {
      onClose();
    }
  }

  function handleCloseClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }

  async function _downloadImage(imgUrl: string): Promise<void> {
    try {
      const rsp = await fetch(imgUrl, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
      });
      const buffer = await rsp.arrayBuffer();
      const url = window.URL.createObjectURL(new Blob([buffer]));
      const link = document.createElement("a");

      const name = imgUrl.split("/").pop();

      link.href = url;
      link.setAttribute("download", name ?? "image.png"); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.warn(e);
    }
  }

  function handleDownloadClick(e: MouseEvent<HTMLElement>): void {
    if (images.length > 1) {
      setDownloadPopupEl(e.currentTarget);
    } else {
      const image = images[0];
      _downloadImage(image);
    }
  }

  function handleDownloadPopupClose(): void {
    setDownloadPopupEl(null);
  }

  function handleDownloadSingle(): void {
    const activeIdx = sliderRef.current?.getActiveIdx() ?? 0;
    const imgUrl = images[activeIdx];
    _downloadImage(imgUrl);
    setDownloadPopupEl(null);
  }

  async function handleDownloadMultiple(): Promise<void> {
    setDownloadPopupEl(null);
    for (const img of images) {
      await _downloadImage(img);
    }
  }


  return (
    <Dialog
      open={open}
      onClose={handleCloseClick}
      fullScreen={downSm ? true : true}
      maxWidth='md'
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: downSm ? "black" : "transparent",
          boxShadow: "none",
        },
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
      }}
    >
      <Box
        position='fixed'
        bottom={downSm ? 0 : 10}
        right={downSm ? 0 : 15}
        zIndex={1200}
      >
        <IconButton
          aria-label='download-image-buttn'
          size={downSm ? "medium" : "large"}
          color='white'
          onClick={(e): void => handleDownloadClick(e)}
        >
          <DownloadIcon sx={{ fontSize: downSm ? 35 : 45 }} />
        </IconButton>
        <Menu
          anchorEl={downloadPopupEl}
          open={Boolean(downloadPopupEl)}
          onClose={handleDownloadPopupClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleDownloadSingle}>
            <ListItemIcon>
              <PhotoOlIcon />
            </ListItemIcon>
            <ListItemText>{t("thisPicture")}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDownloadMultiple}>
            <ListItemIcon>
              <PhotoLibraryOlIcon />
            </ListItemIcon>
            <ListItemText>{t("all")}</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      <Box
        position='fixed'
        top={0}
        right={0}
        zIndex={1200}
      >
        <IconButton
          aria-label='close-image-button'
          size={downSm ? "medium" : "large"}
          color='white'
          onClick={(e): void => handleCloseClick(e)}
        >
          <CloseIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      <Box
        width='100%'
        margin='auto'
      >
        <ImageSlider
          ref={sliderRef}
          imgs={images}
          isFull
          height={downSm ? "100vh" : "70vh"}
          initialIdx={initialIdx}
          showNavigation={downSm ? false : true}
        />
      </Box>
    </Dialog>
  );
}
