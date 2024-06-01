import React, { useState, useCallback, MouseEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Slider, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Row, Box, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import Cropper from "react-easy-crop";
import type { Point as PointT, Area as AreaT } from "react-easy-crop";
import { getCroppedImg } from "./utils";

// https://valentinh.github.io/react-easy-crop/

export type ImageCropperProps = {
  image: string;
  cropShape?: "rect" | "round";
  aspect?: number;
  submitDisabled?: boolean;
  onCancel?: () => any;
  onApply: (cropped: string) => any;
};

export function ImageCropper({
  image,
  cropShape,
  aspect,
  submitDisabled: userSubmitDisable,
  onCancel,
  onApply,
}: ImageCropperProps): ReactNode {
  const t = useTranslations("ui.tools.ImageCropper");

  const theme = useTheme();
  const [crop, setCrop] = useState<PointT>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<AreaT | null>(null);

  const showCancel = Boolean(onCancel);

  const submitDisable = userSubmitDisable || !croppedAreaPixels;

  const handleCropComplete = useCallback((croppedArea: AreaT, croppedAreaPixel: AreaT) => {
    setCroppedAreaPixels(croppedAreaPixel);
  }, []);

  function handleCropChange(position: PointT): void {
    setCrop(position);
  }

  function handleZoomChange(zoom: number): void {
    setZoom(zoom);
  }

  function handleRotationChange(e: Event, rotation: number | number[]): void {
    if (typeof rotation == "number") {
      setRotation(rotation);
    }
  }

  function handleCancelClick(e: MouseEvent<HTMLButtonElement>): void {
    if (!onCancel) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  }

  const handleApplyClick = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    if (!croppedAreaPixels) {
      return;
    }
    const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
    if (!croppedImage) {
      return;
    }
    onApply(croppedImage);
  };


  return (
    <Box position='relative'>
      <Box
        position='relative'
        width='100%'
        sx={{
          height: "200px",
          [theme.breakpoints.up("sm")]: {
            height: "300px",
          },
        }}
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={handleCropChange}
          onCropComplete={handleCropComplete}
          onZoomChange={handleZoomChange}
          cropShape={cropShape}
        />
      </Box>

      <Box
        position='relative'
        display='flex'
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent='center'
        alignItems='center'
        // maxWidth={{ xs: '80%', sm: undefined }}
        px={4}
        width='100%'
        // bgcolor={'green'}
      >
        <Row
          flex={1}
          width='100%'
        >
          <Box width={50}>
            <Txt variant='body3' fontWeight={700}>{t("zoom")}</Txt>
          </Box>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.02}
            onChange={(e, zoom): void => handleZoomChange(zoom as number)}
          />
        </Row>

        <Gap x={2} />

        <Row
          flex={1}
          width='100%'
        >
          <Box width={50}>
            <Txt variant='body3' fontWeight={700}>{t("rotate")}</Txt>
          </Box>
          <Slider
            value={rotation}
            min={0}
            max={360}
            step={1}
            onChange={handleRotationChange}
          />
        </Row>
      </Box>
      <Box p={1}>
        <Row justifyContent='end'>
          {showCancel && <Button onClick={handleCancelClick}>{t("cancel")}</Button>}
          <Button
            variant='contained'
            onClick={handleApplyClick}
            disabled={submitDisable}
          >
            {t("apply")}
          </Button>
        </Row>
      </Box>
    </Box>
  );
}

