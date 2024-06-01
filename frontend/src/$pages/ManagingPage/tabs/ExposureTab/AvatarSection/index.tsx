import React from "react";
import { useTranslations } from "next-intl";
import { Box, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EditableAvatar } from "@/ui/tools/EditableAvatar";
import { buildImgUrl, uploadToS3 } from "@/utils/media";
import * as BoardApi from "@/apis/boards";
import type { BoardT } from "@/types";

type AvatarSectionProps = {
  board: BoardT;
  onBoardUpdate: (data: Partial<BoardT>) => any;
};

export function AvatarSection({
  board,
  onBoardUpdate,
}: AvatarSectionProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.ExposureTab.AvatarSection");

  async function handleAvatarSelect(imgFile: File): Promise<void> {
    try {
      const { key, putUrl } = await BoardApi.getDefaultAvatarPresignedUrl(board.id, imgFile.type);
      await uploadToS3(putUrl, imgFile);
      onBoardUpdate({ default_avatar_path: key });
    } catch (e) {
      console.warn(e);
    }
  }

  function handleAvatarRemove(): void {
    onBoardUpdate({ default_avatar_path: null });
  }

  return (
    <Box py={2}>
      <Col alignItems='center'>
        <EditableAvatar
          src={board.default_avatar_path ? buildImgUrl(null, board.default_avatar_path, { size: "xs" }) : undefined}
          onImageSelect={handleAvatarSelect}
          onImageRemove={handleAvatarRemove}
        />

        <Gap y={1} />

        <Txt
          variant='subtitle2'
          sx={{ fontWeight: 500 }}
        >
          {t("defaultAvatar")}
        </Txt>
      </Col>
    </Box>
  );
}
