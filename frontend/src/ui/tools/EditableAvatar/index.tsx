import React, { ReactNode } from "react";
import { Badge, Avatar } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { ProfileEditButton } from "./ProfileEditButton";

type EditableAvatarProps = {
  src?: string;
  buttonSize?: string;
  showCropper?: boolean;
  onImageSelect: (imgFile: File) => any;
  onImageRemove: () => any;
  renderAvatar?: (src: string | undefined) => ReactNode;
};


export function EditableAvatar({
  src,
  buttonSize,
  showCropper = true,
  onImageSelect,
  onImageRemove,
  renderAvatar,
}: EditableAvatarProps): JSX.Element {

  const { downSm, downMd } = useResponsive();

  const avatarSize = downSm ? 80 : downMd ? 90 : 100;

  return (
    <Badge
      overlap='circular'
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent={
        <ProfileEditButton
          src={src}
          showCropper={showCropper}
          onSelect={onImageSelect}
          onRemove={onImageRemove}
          size={buttonSize}
        />
      }
    >
      {renderAvatar ? (
        renderAvatar(src)
      ) : (
        <Avatar
          src={src}
          sx={{
            width: avatarSize,
            height: avatarSize,
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      )}
    </Badge>
  );
}
