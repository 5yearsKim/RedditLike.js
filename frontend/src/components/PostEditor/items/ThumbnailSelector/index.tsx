"use client";

import React, { RefObject, useEffect, useState, Fragment } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useResponsive } from "@/hooks/Responsive";
import { RichEditor2T } from "@/components/RichEditor2";
import { Clickable } from "@/ui/tools/Clickable";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";
import { Row, Col, Gap, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CropIcon, InfoOlIcon } from "@/ui/icons";
import { Box, Button, Dialog } from "@mui/material";
import { useImageCropper } from "@/hooks/dialogs/ImageCropperDialog";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import * as PostApi from "@/apis/posts";
import { uploadToS3, buildImgUrl } from "@/utils/media";
import { env } from "@/env";

type ThumbnailSelectorProps = {
  editorRef: RefObject<RichEditor2T>;
  thumbnail: string | null;
  onChange: (data: string | null) => void;
};

export function ThumbnailSelector({
  editorRef,
  thumbnail,
  onChange,
}: ThumbnailSelectorProps): JSX.Element {
  const t = useTranslations("components.PostEditor.ThumbnailSelector");

  const { downSm } = useResponsive();

  const [cands, setCands] = useState<string[]>([]);
  const [selectedCand, setSelectedCand] = useState<string | null>(null);

  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);

  const { showImageCropper } = useImageCropper();
  const { showAlertDialog } = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (selectorOpen) {
      _refreshCands();
    }
  }, [selectorOpen]);

  function _getCands(): string[] {
    const imgs = editorRef.current?.querySelectAll("img") ?? [];

    return Array.from(imgs)
      .filter((img) => img.classList.contains("post-image"))
      .map((img) => img.getAttribute("src"))
      .filter((val) => val !== null) as string[];
  }

  function _refreshCands(): void {
    const newCands = _getCands();
    if (thumbnail && !cands.includes(thumbnail)) {
      newCands.push(thumbnail);
    }
    setCands(newCands as string[]);
  }

  function handleSelectorOpen(): void {
    setSelectorOpen(true);
  }

  function handleSelectorClose(): void {
    setSelectorOpen(false);
  }

  function handleCandSelect(cand: string): void {
    if (cand == selectedCand) {
      setSelectedCand(null);
    } else {
      setSelectedCand(cand);
    }
  }

  function handleSelectorSubmit(): void {
    if (!selectedCand) {
      return;
    }
    onChange(selectedCand);
    setSelectorOpen(false);
  }

  async function handleImageCropClick(): Promise<void> {
    if (!thumbnail) {
      return;
    }
    if (new URL(thumbnail).host !== new URL(env.RESOURCE_URL).host) {
      enqueueSnackbar(t("cannotCropExternal", { externalUrl: (new URL(thumbnail)).host }), { variant: "error" });
      return;
    }
    const cropResult = await showImageCropper({
      src: thumbnail,
      aspect: 1,
      cropShape: "rect",
    });
    if (cropResult == null) {
      return;
    }
    const { imgFile } = cropResult;

    const { putUrl, key } = await PostApi.getImagePresignedUrl(imgFile.type);
    await uploadToS3(putUrl, imgFile);

    const newThumbnailSrc = buildImgUrl(null, key);
    onChange(newThumbnailSrc);
  }

  async function handleDeleteThumbnail(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("selectAgain"),
      body: t("selectAgainMsg"),
      useOk: true,
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
    // logic
    onChange(null);
  }

  const previewSize = downSm ? 80 : 100;

  return (
    <>
      <Row
        justifyContent='center'
        alignItems='center'
      >
        <Col
          alignItems='center'
          minWidth='150px'
        >
          <Row columnGap={1}>
            <Txt
              variant='body2'
              fontWeight={700}
            >
              {t("postThumbnail")}
            </Txt>
            <HelperTooltip tip={t("postThumbnailHelper")}/>
          </Row>

          <Gap y={1} />

          {thumbnail == null ? (
            <Button
              variant='outlined'
              size='small'
              onClick={handleSelectorOpen}
            >
              {t("selectThumbnail")}
            </Button>
          ) : (
            <Col>
              <Button
                variant='outlined'
                size='small'
                onClick={handleDeleteThumbnail}
              >
                {t("selectAgain")}
              </Button>
              <Box mt={0.5} />
              <Button
                variant='contained'
                size='small'
                startIcon={<CropIcon fontSize='small' />}
                onClick={handleImageCropClick}
              >
                {t("crop")}
              </Button>
            </Col>
          )}
        </Col>
        <Center
          // bgcolor='green'
          borderRadius={1}
          overflow='hidden'
        >
          {thumbnail == null ? (
            <Clickable
              width={previewSize}
              border='dashed 1px rgba(128, 128, 128, 0.5)'
              sx={{
                aspectRatio: 1,
              }}
              onClick={handleSelectorOpen}
            >
              <Txt
                variant='h5'
                color='vague.main'
              >
                +
              </Txt>
            </Clickable>
          ) : (
            <Clickable
              width={previewSize}
              sx={{
                aspectRatio: 1,
              }}
              onClick={handleSelectorOpen}
            >
              <Image
                src={thumbnail}
                alt={thumbnail}
                width={previewSize}
                height={previewSize}
                style={{ objectFit: "cover" }}
              />
            </Clickable>
          )}
        </Center>
      </Row>

      <Dialog
        open={selectorOpen}
        onClose={handleSelectorClose}
        maxWidth='sm'
        // fullWidth
      >
        <Col p={1}>
          {cands.length == 0 && (
            <Row alignItems='flex-start'>
              <InfoOlIcon sx={{ color: "vague.main", mr: 0.5 }} />
              <Txt
                color='vague.main'
                sx={{ verticalAlign: "middle" }}
              >
                {t("addImageToSelect")}
              </Txt>
            </Row>
          )}
          <Row
            flexWrap='wrap'
            justifyContent='center'
            columnGap={1}
            rowGap={1}
          >
            {cands.map((cand) => {
              const imSize = downSm ? 80 : 100;
              const isSelected = cand == selectedCand;
              return (
                <Fragment key={cand}>
                  <Clickable
                    border={`solid 2px ${isSelected ? "#ff5522" : "transparent"}`}
                    borderRadius={1}
                    overflow='hidden'
                    width='fit-content'
                    onClick={(): void => handleCandSelect(cand)}
                  >
                    <Image
                      src={cand}
                      width={imSize}
                      height={imSize}
                      alt={cand}
                      style={{ objectFit: "cover" }}
                    />
                  </Clickable>
                </Fragment>
              );
            })}
          </Row>

          <Gap y={2} />
          <Row justifyContent='flex-end'>
            <Button onClick={handleSelectorClose}>
              {t("cancel")}
            </Button>
            <Button
              variant='contained'
              disabled={selectedCand == null}
              onClick={handleSelectorSubmit}
            >
              {t("apply")}
            </Button>
          </Row>
        </Col>
      </Dialog>
    </>
  );
}
