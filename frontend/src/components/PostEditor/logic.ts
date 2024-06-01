"use client";

import { useState, useEffect, useRef, useMemo, useImperativeHandle } from "react";
import { useTranslations } from "next-intl";
import type { ForwardedRef, MouseEvent, ChangeEvent, SyntheticEvent } from "react";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import { useRouter } from "next/navigation";
import { extractText } from "@/utils/html";
import { RichEditor2T } from "@/components/RichEditor2";
import { useSnackbar } from "@/hooks/Snackbar";
import { TabT } from "./data";
import { PostEditorProps, PostEditorT } from "./type";
import { isBefore } from "date-fns";
import type { ImageT, VideoT, FlagT, PostT, PostFormT } from "@/types";

// import { StorageTrackS } from "@/services/StorageTrack";

const { persistAtom } = recoilPersist();

const titleState = atom<string>({
  key: "titleState_PostEditor",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

const bodyState = atom<string>({
  key: "bodyState_PostEditor",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

// const imagesState = atom<(File|ImageT)[]>({
//   key: 'imagesState_PostEditor',
//   default: [],
// });

// const videosState = atom<(File|ImageT)[]>({
//   key: 'videosState_PostEditor',
//   default: [],
// });

// eslint-disable-next-line
export function useLogic(props: PostEditorProps, ref: ForwardedRef<PostEditorT>) {
  const {
    author,
    me,
    board,
    isManager,
    post,
    submitDisabled,
    loadDraft,
    saveDraft,
    onSubmit,
    onCancel,
    onDraftSave,
  } = props;

  const t = useTranslations("components.PostEditor");

  const router = useRouter();
  const richEditorRef = useRef<RichEditor2T | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const [title, setTitle] = useRecoilState(titleState);
  const [body, setBody] = useRecoilState(bodyState);
  const [images, setImages] = useState<(File | ImageT)[]>([]);
  // const [images, setImages] = useRecoilState(imagesState);
  const [videos, setVideos] = useState<(File | VideoT)[]>([]);
  // const [videos, setVideos] = useRecoilState(videosState);
  const [showTabs, setShowTabs] = useState<boolean>(false);
  const [tab, setTab] = useState<TabT>("post");
  const [flags, setFlags] = useState<FlagT[]>([]);
  const [isNsfw, setIsNsfw] = useState<boolean | undefined>();
  const [isSpoiler, setIsSpoiler] = useState<boolean | undefined>();
  const [showManager, setShowManager] = useState<boolean>(false);

  const [thumbPath, setThumbPath] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);
  const [reservedAt, setReservedAt] = useState<Date | null>(null);

  useImperativeHandle(ref, () => ({
    checkHasChanged: (): boolean => {
      if (post) {
        return (
          post.title !== title ||
          post.body !== body ||
          JSON.stringify(post.images) !== JSON.stringify(images) ||
          JSON.stringify(post.videos) !== JSON.stringify(videos)
        );
      } else {
        return Boolean(title.length || body.length || images.length || videos.length);
      }
    },
    reset: (): void => {
      setTitle("");
      setBody("");
      setImages([]);
      setVideos([]);
    },
    // importFromCrawled: (crawled: CrawlResultT): void => {
    //   setTitle(crawled.title);
    //   setBody(crawled.bodyHtml);
    //   setImages([]);
    //   setVideos([]);
    // },
  }));

  const showCancel = Boolean(onCancel);
  const hasContent = useMemo(() => {
    const holder = { post: false, photo: false, video: false };

    const bodyTrimmed = extractText(body, "html").trim();
    if (bodyTrimmed.length) {
      holder["post"] = true;
    }
    if (images.length) {
      holder["photo"] = true;
    }
    if (videos.length) {
      holder["video"] = true;
    }
    return holder;
  }, [body, images, videos ]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      if (post.body) {
        setBody(post.body);
        setTab("post");
      } else if (post.images?.length) {
        setImages(post.images);
        setTab("photo");
        setShowTabs(true);
      } else if (post.videos?.length) {
        setVideos(post.videos);
        setTab("video");
        setShowTabs(true);
      }

      if (post.is_nsfw) {
        setIsNsfw(true);
      } else if (post.is_spoiler) {
        setIsSpoiler(true);
      }
      setFlags(post.flags ?? []);
      setShowManager(post.show_manager);
      setReservedAt(post.reserved_at ? new Date(post.reserved_at) : null);
      setThumbPath(post.thumb_path ?? null);
    }
  }, [post?.id]);

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>): void {
    const maxLen = 80;
    let val = e.target.value;
    if (val.length > maxLen) {
      val = val.slice(0, maxLen);
    }
    setTitle(val);
  }

  function handleBodyChange(value: string): void {
    setBody(value);
  }

  function handleShowTabs(): void {
    setShowTabs(true);
    setTab("video");
  }

  function handleShowImageDialog(): void {
    richEditorRef.current?.showImageDialog();
  }

  function handleShowPollDialog(): void {
    richEditorRef.current?.showPollDialog();
  }

  async function handleTabChange(e: SyntheticEvent, newTab: TabT): Promise<void> {
    if (newTab == tab) {
      return;
    }
    setTab(newTab);
  }

  function handleImagesChange(images: (File | ImageT)[]): void {
    setImages(images);
  }

  function handleVideosChange(videos: (File | VideoT)[]): void {
    setVideos(videos);
  }

  const form: PostFormT = {
    author_id: me!.id,
    board_id: board.id,
    title,
    body,
    body_type: "html",
    is_nsfw: isNsfw,
    is_spoiler: isSpoiler,
    show_manager: showManager,
    thumb_path: thumbPath,
    reserved_at: reservedAt,
  };
  const flagsVal = flags;
  const imagesVal = images.filter((img) => !(img instanceof File)) as ImageT[];
  const videosVal = videos.filter((video) => !(video instanceof File)) as VideoT[];

  // function _extractImageKeys(): string[] {
  //   // validate images
  //   const imgKeys: string[] = [];
  //   const htmlImgs = richEditorRef.current?.querySelectAll("img") ?? [];

  //   const _pushToKeys = (src: string): void => {
  //     const url = new URL(src);
  //     if (url.hostname == "resources.nuco.kr") {
  //       imgKeys.push(url.pathname);
  //     }
  //   };

  //   for (const img of Array.from(htmlImgs)) {
  //     const src = img.getAttribute("src") ?? "";
  //     _pushToKeys(src);
  //   }
  //   for (const img of imagesVal) {
  //     _pushToKeys(img.url);
  //   }
  //   if (thumbnail) {
  //     _pushToKeys(thumbnail);
  //   }
  //   return imgKeys;
  // }

  // function _extractVideoKeys(): string[] {
  //   return videosVal.map((video) => new URL(video.url).pathname);
  // }

  // async function _validateStorage(post: MPostT, imgKeys: string[], videoKeys: string[]): Promise<void> {
  //   try {
  //     if (imgKeys.length > 0) {
  //       await StorageTrackS.validate(imgKeys, { post_id: post.id });
  //     }
  //     if (videoKeys.length > 0) {
  //       await StorageTrackS.validate(videoKeys, { post_id: post.id });
  //     }
  //   } catch (e) {
  //     console.warn(e);
  //   }
  // }

  function _inferenceThumbnail(): string | null {
    const allImgs = richEditorRef.current?.querySelectAll("img");
    for (const img of Array.from(allImgs ?? [])) {
      if (img.classList.contains("post-image")) {
        return img.getAttribute("src");
      }
    }
    return null;
  }

  async function handleSubmit(): Promise<void> {
    if (form.reserved_at) {
      if (isBefore(form.reserved_at, new Date())) {
        enqueueSnackbar(t("selectReserveTimeAgain"), { variant: "warning" });
        return;
      } else {
        handleDraftSave();
        return;
      }
    }

    if (!thumbPath) {
      form.thumb_path = _inferenceThumbnail();
    }

    // const storageImageKeys = _extractImageKeys();
    // const storageVideoKeys = _extractVideoKeys();

    await onSubmit(form, {
      flags: flagsVal,
      images: imagesVal,
      videos: videosVal,
    });

    // if (created) {
    //   _validateStorage(created, storageImageKeys, storageVideoKeys);
    // }
  }

  function handleCancel(): void {
    if (onCancel) {
      onCancel(form, {
        flags: flagsVal,
        images: imagesVal,
        videos: videosVal,
      });
    }
  }

  function handleDraftSave(): void {
    onDraftSave(form, {
      flags: flagsVal,
      images: imagesVal,
      videos: videosVal,
    });
  }

  function handleDraftApply(post: PostT): void {
    router.push(`/boards/${board.id}/update-post/${post.id}`);
  }

  function handleFlagsChange(flags: FlagT[]): void {
    setFlags(flags);
  }

  function handleNsfwClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    const val = !isNsfw;
    setIsNsfw(val);
    if (val && isSpoiler) {
      setIsSpoiler(false);
    }
  }
  function handleSpolilerClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    const val = !isSpoiler;
    setIsSpoiler(val);
    if (val && isNsfw) {
      setIsNsfw(false);
    }
  }

  function handleShowManagerChange(e: ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    setShowManager(checked);
  }

  function handleEmptyBottomClick(): void {
    richEditorRef.current?.insertEmptyParagraph();
  }

  function handleThumbPathChange(val: string | null): void {
    setThumbPath(val);
  }

  function handleAdvancedSettingClick(): void {
    setAdvancedOpen(!advancedOpen);
  }

  function handleReservedAtChange(val: Date | null): void {
    setReservedAt(val);
  }

  return {
    author,
    me,
    board,
    isManager,
    submitDisabled,
    loadDraft,
    saveDraft,
    tab,
    title,
    body,
    images,
    videos,
    isSpoiler,
    isNsfw,
    flags,
    hasContent,
    showCancel,
    showTabs,
    richEditorRef,
    showManager,
    thumbPath,
    advancedOpen,
    reservedAt,
    handleSubmit,
    handleCancel,
    handleDraftSave,
    handleDraftApply,
    handleTitleChange,
    handleBodyChange,
    handleImagesChange,
    handleVideosChange,
    handleTabChange,
    handleFlagsChange,
    handleNsfwClick,
    handleSpolilerClick,
    handleShowTabs,
    handleShowImageDialog,
    handleShowPollDialog,
    handleShowManagerChange,
    handleEmptyBottomClick,
    handleThumbPathChange,
    handleAdvancedSettingClick,
    handleReservedAtChange,
  };
}
