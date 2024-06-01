import { useTranslations } from "next-intl";
import { PostAddIcon, PhotoAddIcon, VideoAddIcon } from "@/ui/icons";

export type TabT = "post" | "photo" | "video";

export function useTabCands() {
  const t = useTranslations("components.PostEditor");

  const tabCands = {
    post: { label: t("post"), icon: PostAddIcon, value: "post" },
    photo: { label: t("image"), icon: PhotoAddIcon, value: "photo" },
    video: { label: t("video"), icon: VideoAddIcon, value: "video" },
  };
  return tabCands;
}
