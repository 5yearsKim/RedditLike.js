"use client";

import React, { useEffect, useState, useRef, useMemo, ChangeEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { IconButton, Dialog, Box, CircularProgress } from "@mui/material";
import { Clickable } from "@/ui/tools/Clickable";
import { CloseIcon, EditIcon } from "@/ui/icons";
import { Row, Gap, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EmptyMediaEditor } from "../EmptyMediaEditor";
import { PreviewBox } from "./style";
// logic
import { convertFileInArray, uploadToS3, getImageSize, buildImgUrl } from "@/utils/media";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import * as PostApi from "@/apis/posts";
import * as ImageApi from "@/apis/images";
import type { ImageT } from "@/types";
// import { StorageTrackS } from "@/services/StorageTrack";

// import { ImageEditor } from "@/ui/tools/ImageEditor";
import dynamic from "next/dynamic";
const ImageEditor = dynamic(
  () => import("@/ui/tools/ImageEditor").then(module => module.ImageEditor),
  { ssr: false }
);


export type PhotoEditorProps = {
  images: (ImageT | File)[];
  onImagesUpdated: (images: (File | ImageT)[]) => void;
};

export function PhotoEditor({
  images,
  onImagesUpdated,
}: PhotoEditorProps): ReactNode {
  const t = useTranslations("components.PostEditor.PhotoEditor");

  const addPhotoRef = useRef<null | HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [selectedIdx, setSelectedIdx] = useState<undefined | number>();
  const { showAlertDialog } = useAlertDialog();

  async function _onImageChange(): Promise<void> {
    if (!images.some((item) => item instanceof File)) {
      return;
    }
    try {
      const newImages = await convertFileInArray(images, async (file) => {
        const { putUrl, key } = await PostApi.getImagePresignedUrl(file.type);
        await uploadToS3(putUrl, file, (amount) => {
          if (!progress || progress < amount) {
            setProgress(amount);
          }
        });
        const { width, height } = await getImageSize(URL.createObjectURL(file));
        const uploadedImage = await ImageApi.create({
          path: key,
          mime_type: file.type,
          width,
          height,
        });

        // await StorageTrackS.create({
        //   user_id: -1,
        //   key: new URL(uploadedImage.url).pathname,
        //   type: "post",
        // });
        return uploadedImage;
      });
      onImagesUpdated(newImages);
      setProgress(null);
    } catch (e) {
      console.warn(e);
    }
  }

  useEffect(() => {
    _onImageChange();
  }, [images]);

  useEffect(() => {
    if (images.length >= 1 && !selectedIdx) {
      setSelectedIdx(images.length - 1);
    }
  }, [images]);

  const selected: null | File | ImageT = useMemo(() => {
    if (selectedIdx === undefined || selectedIdx > images.length) {
      return null;
    }
    return images[selectedIdx];
  }, [selectedIdx, images]);

  function handlePreviewClick(idx: number): void {
    setSelectedIdx(idx);
  }

  async function handleDeletePhotoClick(): Promise<void> {
    if (selectedIdx === undefined || selectedIdx > images.length) {
      return;
    }
    const isOk = await showAlertDialog({
      title: t("deleteImage"),
      body: t("deleteImageMsg"),
      useOk: true,
      useCancel: true,
    });
    if (isOk !== true) {
      return;
    }
    const newImgs = [...images];
    newImgs.splice(selectedIdx, 1);
    onImagesUpdated(newImgs);
    setSelectedIdx(undefined);
  }

  function handleEditPhotoClick(): void {
    if (selectedIdx === undefined || selectedIdx > images.length) {
      return;
    }
    setEditorOpen(true);
  }

  function handlePhotoEditorUploaded(image: ImageT): void {
    if (selectedIdx === undefined || selectedIdx > images.length) {
      return;
    }
    const newImgs = [...images];
    newImgs.splice(selectedIdx, 1, image);
    onImagesUpdated(newImgs);
    setEditorOpen(false);
  }

  async function handlePhotoEditorCancel(hasChanged: boolean): Promise<void> {
    if (hasChanged) {
      const isOk = await showAlertDialog({
        title: t("closeEditor"),
        body: t("closeEditorMsg"),
        useOk: true,
        useCancel: true,
      });
      if (isOk !== true) {
        return;
      }
    }
    setEditorOpen(false);
  }

  function handleFilesReceive(files: FileList): void {
    const isImage = (file: File): boolean => file.type.includes("image");
    const fileArr = Array.from(files);
    const imgFiles = fileArr.filter(isImage);
    if (imgFiles.length == 0) {
      console.warn("no image received");
      return;
    }
    const newImgs = [...images, ...imgFiles];
    // if (newImgs.length > 30) {
    //   newImgs = newImgs.slice(0, 30);
    // }
    onImagesUpdated(newImgs);
  }

  function handleAddPhotoClick(): void {
    addPhotoRef.current?.click();
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
    const files = e.target.files;
    if (files) {
      handleFilesReceive(files);
    }
  }


  if (!images.length) {
    return (
      <EmptyMediaEditor
        label={t("dragImageOr")}
        acceptFormat='image/*'
        multiple={true}
        onReceiveFiles={handleFilesReceive}
      />
    );
  }

  return (
    <Box>
      {progress && progress > 0 && (
        <Box
          zIndex={99}
          position='fixed'
          top='50%'
          left='50%'
        >
          <Txt variant='body1'>{progress}%</Txt>
        </Box>
      )}

      <Row flexWrap='wrap'>
        {images.map((image, idx) => (
          <PreviewBox
            key={idx}
            onClick={(): void => handlePreviewClick(idx)}
            selected={selected == image}
          >
            {image instanceof File ? (
              <Center height='100%'>
                <CircularProgress size='1.5rem' />
              </Center>
            ) : (
              <Image
                src={buildImgUrl(null, image.path, { size: "xs" })}
                alt='preview-image'
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            )}
          </PreviewBox>
        ))}
        <Clickable onClick={handleAddPhotoClick}>
          <PreviewBox>
            <Center height='100%'>
              <Txt variant='h5'>+</Txt>
            </Center>
          </PreviewBox>
        </Clickable>
        <input
          ref={addPhotoRef}
          hidden
          accept='image/*'
          multiple
          type='file'
          onChange={handleInputChange}
        />
      </Row>

      <Gap y={2} />

      {selected && (
        <Box position='relative'>
          {selected instanceof File ? (
            <Center width='100%'>
              <CircularProgress />
            </Center>
          ) : (
            <Box
              position='relative'
              height='350px'
              p={2}
              border='1px solid #cccccc'
              borderRadius={2}
            >
              <Image
                src={buildImgUrl(null, selected.path)}
                alt='selected-image'
                fill
                style={{
                  objectFit: "contain",
                }}
              />
              <Row
                position='absolute'
                top={0}
                right={0}
              >
                <IconButton
                  aria-label='edit-photo'
                  onClick={handleEditPhotoClick}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label='cancel-photo'
                  onClick={handleDeletePhotoClick}
                >
                  <CloseIcon />
                </IconButton>
              </Row>
            </Box>
          )}
        </Box>
      )}
      {(selected as any)?.url && (
        <Dialog
          open={editorOpen}
          style={{ zIndex: 5 }}
        >
          <ImageEditor
            url={buildImgUrl(null, (selected as ImageT).path)}
            onUploaded={handlePhotoEditorUploaded}
            onCancel={handlePhotoEditorCancel}
          />
        </Dialog>
      )}
    </Box>
  );
}
