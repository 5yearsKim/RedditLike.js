import { AuthorFingerprintProps } from "@/components/AuthorFingerprint";
import type { PostT, BoardManagerT } from "@/types";

export type PostPreviewProps = {
  post: PostT;
  manager?: BoardManagerT|null;
  showBoard?: boolean;
  size?: "medium" | "small";
  fingerprintProps?: AuthorFingerprintProps;
  // onMediaReady?: () => void
};

export type PostPreviewSkeletonProps = {
  size?: "medium" | "small";
};
