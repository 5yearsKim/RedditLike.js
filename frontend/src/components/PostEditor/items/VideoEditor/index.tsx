"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@mui/material";
import { VideoPlayer2 } from "@/ui/tools/VideoPlayer2";

import { Row, Box, Col, Gap, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { DeleteIcon } from "@/ui/icons";
import { CircularProgressWithLabel } from "@/ui/tools/CircularProgressWithLabel";
import { EmptyMediaEditor } from "../EmptyMediaEditor";
//logic
import { uploadToS3, convertFileInArray } from "@/utils/media";
import * as PostApi from "@/apis/posts";
import * as VideoApi from "@/apis/videos";
import type { VideoT, VideoFormT } from "@/types";


type VideoEditorProps = {
  videos: (VideoT | File)[];
  onVideosUpdated: (video: (File | VideoT)[]) => void;
};

export function VideoEditor({
  videos,
  onVideosUpdated,
}: VideoEditorProps): ReactNode {
  const t = useTranslations("components.PostEditor.VideoEditor");
  const [progress, setProgress] = useState<number | null>(null);

  async function _onVideosChange(): Promise<void> {
    if (!videos.some((item) => item instanceof File)) {
      return;
    }
    try {
      const newVideos = await convertFileInArray(videos, async (file) => {
        const { putUrl, key } = await PostApi.getVideoPresignedUrl(file.type);

        await uploadToS3(putUrl, file, (amount: number): void => {
          if (!progress || progress < amount) {
            setProgress(amount);
          }
        });

        const form: VideoFormT = {
          path: key,
          mime_type: file.type,
        };
        const video = await VideoApi.create(form);
        return video;
      });
      onVideosUpdated(newVideos);
      setProgress(null);
    } catch (e) {
      console.warn(e);
    }
  }

  useEffect(() => {
    _onVideosChange();
  }, [videos]);

  function handleFilesReceive(files: FileList): void {
    const fileArr = Array.from(files);
    const vidFiles = fileArr.filter((file: File): boolean => file.type.includes("video"));
    if (vidFiles.length > 1) {
      console.warn("video only 1 allowed..yet");
      return;
    }
    onVideosUpdated([...videos, vidFiles[0]]);
  }

  function handleDeleteVideoClick(): void {
    onVideosUpdated([]);
  }


  if (!videos.length) {
    return (
      <EmptyMediaEditor
        label={t("dragVideoOr")}
        onReceiveFiles={handleFilesReceive}
        acceptFormat='video/*'
        multiple={false}
      />
    );
  }
  if (videos.some((item) => item instanceof File)) {
    return (
      <Center
        width='100%'
        minHeight='200px'
      >
        <Col alignItems='center'>
          <Txt
            variant='subtitle1'
            color='vague.main'
          >
            {t("uploading")}..
          </Txt>
          <Gap y={1} />
          <CircularProgressWithLabel value={(progress ?? 0) * 100} />
        </Col>
      </Center>
    );
  }
  return (
    <Box>
      <VideoPlayer2
        video={videos[0] as VideoT}
        width='100%'
        height='60vh'
        autoPlay='off'
      />
      <Gap y={1} />
      <Row justifyContent='flex-end'>
        <Button
          variant='outlined'
          startIcon={<DeleteIcon />}
          onClick={handleDeleteVideoClick}
        >
          {t("deleteVideo")}
        </Button>
      </Row>
    </Box>
  );
}
