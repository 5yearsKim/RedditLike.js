"use client";

import React, { forwardRef } from "react";
import { useTranslations } from "next-intl";
import { Dialog, Box, Button, IconButton } from "@mui/material";
import { CloseIcon, ImageOlIcon, EditIcon } from "@/ui/icons";
import { Row, Col, Gap, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Clickable } from "@/ui/tools/Clickable";
import { ReorderableGrid } from "@/ui/tools/ReorderableGrid";
import { DndBox } from "../DndBox";
// logic
import {
  useState, useCallback, useRef, useEffect, useImperativeHandle,
  ChangeEvent, MouseEvent,
} from "react";
import { uploadToS3, getImageSize } from "@/utils/media";
import * as PostApi from "@/apis/posts";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { useResponsive } from "@/hooks/Responsive";
import { dataURLtoFile } from "@/utils/media";

import dynamic from "next/dynamic";
const ImageEditor = dynamic(
  () => import("@/ui/tools/ImageEditor").then(module => module.ImageEditor),
  { ssr: false }
);

export type ImageAddDialogT = {
  addFiles: (files: File[]) => void;
};

type ImageAddDialogProps = {
  open: boolean;
  // isUploading?: boolean;
  // onSubmit: (files: File[]) => any;
  onUploaded: (imgInfos: {key: string, width?: number, height?: number}[] ) => void
  onClose: () => void;
};


export const ImageAddDialog = forwardRef<ImageAddDialogT, ImageAddDialogProps>(
  (props: ImageAddDialogProps, ref): JSX.Element => {
    const {
      open,
      onUploaded,
      onClose,
    } = props;

    const t = useTranslations("components.RichEditor2.ImageAddDialog");

    const { downSm } = useResponsive();
    const imgInputRef = useRef<HTMLInputElement | null>(null);
    const [imgFiles, setImgFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [editingImageInfo, setEditingImageInfo] = useState<{url: string; idx: number;} | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const submitDisabled = isUploading;

    const { enqueueSnackbar } = useSnackbar();
    const { showAlertDialog } = useAlertDialog();

    useImperativeHandle(ref, () => ({
      addFiles(files: File[]): void {
        setImgFiles([...imgFiles, ...files]);
      },
    }));

    useEffect(() => {
      if (open && imgFiles.length == 0) {
        handleImgInputOpen();
      }
    }, [open]);

    async function handleClose(): Promise<void> {
      if (imgFiles.length > 0) {
        const isOk = await showAlertDialog({
          title: t("closeEditor"),
          body: t("closeEditorMsg"),
          useCancel: true,
          useOk: true,
        });
        if (isOk === true) {
          setImgFiles([]);
          onClose();
        }
      } else {
        setImgFiles([]);
        onClose();
      }
    }

    async function handleSubmit(): Promise<void> {
      try {
        setIsUploading(true);
        const uploadPromises = imgFiles.map(async (file): Promise<{key: string, width: number, height: number}> => {
          const { putUrl, key } = await PostApi.getImagePresignedUrl(file.type);
          const { width, height } = await getImageSize(URL.createObjectURL(file));

          await uploadToS3(putUrl, file);
          return { key, width, height };
        });
        const imgMetas = await Promise.all(uploadPromises);
        onUploaded(imgMetas);

        setImgFiles([]);
        setIsUploading(false);
      } catch (e) {
        setIsUploading(false);
        enqueueSnackbar(t("imageUploadFailed"), { variant: "error" });
      }
    }

    function handleImgInputOpen(): void {
      if (imgInputRef.current) {
        imgInputRef.current.value = "";
        imgInputRef.current.click();
      }
    }

    function handleUploadChange(e: ChangeEvent<HTMLInputElement>): void {
      const files = e.target.files;
      if (files) {
        handleReceiveFiles(files);
      }
    }
    const handleReceiveFiles = useCallback(
      (files: FileList): void => {
        const newFiles = Array.from(files);
        const tmpHolder = [...imgFiles];
        for (const newFile of newFiles) {
          const dupItem = imgFiles.find((imgFile) => newFile.name == imgFile.name);
          if (dupItem) {
            enqueueSnackbar(t("imageAlreadyIncluded"), { variant: "info" });
            continue;
          }
          tmpHolder.push(newFile);
        }
        setImgFiles(tmpHolder);
      },
      [imgFiles],
    );

    function handleImgFilesReorded(idFiles: { id: string | number; file: File }[]): void {
      setImgFiles(idFiles.map((idFile) => idFile.file));
    }

    function handleImageDeleteClick(e: MouseEvent<HTMLButtonElement>, idx: number | undefined): void {
      e.stopPropagation();
      e.preventDefault();
      if (idx == undefined) {
        return;
      }
      if (idx >= imgFiles.length) {
        return;
      }
      const newImgs = [...imgFiles];
      newImgs.splice(idx, 1);
      setImgFiles(newImgs);
    }

    function handleImageCropClick(e: MouseEvent<HTMLButtonElement>, idx: number | undefined): void {
      e.stopPropagation();
      e.preventDefault();
      if (idx == undefined) {
        return;
      }
      if (idx >= imgFiles.length) {
        return;
      }
      const imgFile = imgFiles[idx];
      setEditingImageInfo({ url: URL.createObjectURL(imgFile), idx: idx });
    }

    function handleImageEditorApply(imageBase64?: string): void {
      if (imageBase64) {
        const imgFile = dataURLtoFile(imageBase64, "editImage");
        const newImgFiles = [...imgFiles];
        newImgFiles.splice(editingImageInfo!.idx, 1, imgFile);
        setImgFiles(newImgFiles);
      }
      setEditingImageInfo(null);
    }

    function handleImageEditorClose(): void {
      setEditingImageInfo(null);
    }


    function renderEmpty(): JSX.Element {
      return (
        <Center
          width='100%'
          minHeight={downSm ? "200px" : "250px"}
        >
          {downSm ? (
            <Row>
              <Button
                onClick={handleImgInputOpen}
                variant='contained'
                component='label'
                startIcon={<ImageOlIcon />}
              >
                {t("upload")}
              </Button>
            </Row>
          ) : (
            <Col alignItems='center'>
              <ImageOlIcon sx={{ color: "vague.main", fontSize: 42 }} />
              <Row>
                <Txt
                  color='vague.main'
                  variant='subtitle1'
                >
                  {t("dragAndDropOr")}
                </Txt>
                <Gap x={1} />
                <Button
                  onClick={handleImgInputOpen}
                  variant='contained'
                  component='label'
                >
                  {t("upload")}
                </Button>
              </Row>
            </Col>
          )}
        </Center>
      );
    }

    function renderImages(): JSX.Element {
      const imgSize = downSm ? "calc((100vw - 110px)/4)" : "100px";
      return (
        <div>
          <ReorderableGrid
            items={imgFiles.map((file) => ({ id: file.name, file: file }))}
            onReorder={handleImgFilesReorded}
            columns={downSm ? 4 : 5}
            renderItem={(item, index): JSX.Element => {
              return (
                <Box
                  key={item.id}
                  position='relative'
                  sx={{ cursor: "pointer" }}
                >
                  <img
                    src={URL.createObjectURL(item.file)}
                    alt={`${item.id}`}
                    style={{
                      width: imgSize,
                      height: imgSize,
                      objectFit: "cover",
                    }}
                  />

                  {index !== undefined && (
                    <>
                      <Center
                        position='absolute'
                        bottom={0}
                        right={0}
                        // bgcolor='rgba(255, 255, 255, 0.5)'
                        bgcolor='rgba(0, 0, 0, 0.2)'
                        color='#fff'
                        borderRadius={10}
                        fontWeight={700}
                        fontSize={"12px"}
                        minWidth='16px'
                      >
                        {index}
                      </Center>
                      <Row
                        position='absolute'
                        top={0}
                        right={0}
                      >
                        <IconButton
                          aria-label='crop-photo'
                          onClick={(e): void => handleImageCropClick(e, index)}
                          size='small'
                          color='white'
                          sx={{
                            margin: "2px",
                            padding: "2px",
                            bgcolor: "rgba(0,0,0, 0.2)",
                            "&:hover": {
                              bgcolor: "rgba(0, 0, 0, 0.4)",
                            },
                          }}
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>

                        <IconButton
                          aria-label='cancel-photo'
                          onClick={(e): void => handleImageDeleteClick(e, index)}
                          size='small'
                          color='white'
                          sx={{
                            margin: "2px",
                            padding: "2px",
                            bgcolor: "rgba(0,0,0, 0.2)",
                            "&:hover": {
                              bgcolor: "rgba(0, 0, 0, 0.4)",
                            },
                          }}
                        >
                          <CloseIcon fontSize='small' />
                        </IconButton>
                      </Row>
                    </>
                  )}
                </Box>
              );
            }}
            renderTail={(): JSX.Element => {
              return (
                <Clickable
                  width={imgSize}
                  height={imgSize}
                  border={"dashed 2px #888888"}
                  color='#888888'
                  fontSize={32}
                  fontWeight={700}
                  onClick={(): void => handleImgInputOpen()}
                >
                  <span>+</span>
                </Clickable>
              );
            }}
          />
          <Row justifyContent='flex-end'>
            <Button onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button
              variant='contained'
              disabled={submitDisabled}
              onClick={handleSubmit}
            >
              {t("apply")}
            </Button>
          </Row>
          <Dialog
            open={Boolean(editingImageInfo)}
            onClose={handleImageEditorClose}
            fullWidth
            maxWidth='sm'
            sx={{
              zIndex: 1602, // 1 higher than ImageAddDialog
            }}
          >
            {editingImageInfo && (
              <ImageEditor
                url={editingImageInfo.url}
                onSaved={handleImageEditorApply}
                onCancel={handleImageEditorClose}
              />
            )}
          </Dialog>
        </div>
      );
    }

    return (
      <>
        <input
          id='img-input'
          hidden
          accept={"image/*"}
          multiple
          type='file'
          ref={imgInputRef}
          onChange={handleUploadChange}
        />
        <Dialog
          maxWidth='sm'
          fullWidth
          open={open}
          onClose={handleClose}
          sx={{
            zIndex: 1601,
          }}
        >
          <DndBox
            onReceiveFiles={handleReceiveFiles}
            setIsDragging={setIsDragging}
            p={downSm ? 1 : 2}
            bgcolor={isDragging ? "rgba(0, 0, 0, 0.1)" : undefined}
          >
            {imgFiles.length > 0 ? renderImages() : renderEmpty()}
          </DndBox>
        </Dialog>
      </>
    );
  },
);
