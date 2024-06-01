"use client";
import { useState, useEffect, useRef, ForwardedRef, useImperativeHandle, MouseEvent, FocusEvent } from "react";
import { useEditor } from "@tiptap/react";
import { useSnackbar } from "@/hooks/Snackbar";
import { useUrlState } from "@/hooks/UrlState";
// import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
// import { StorageTrackS } from "@/services/StorageTrack";
import { checkUrl } from "@/utils/misc";
import { ImageAddDialogT } from "./items/ImageAddDialog";
import type { RichEditor2Props, RichEditor2T } from "./type";

import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";

import { createLowlight, common } from "lowlight";

// import Increment from './extensions/Increment';
import Youtube, { isValidYoutubeUrl } from "./extensions/Youtube";
import LinkPreview from "./extensions/LinkPreview";
import Tweet from "./extensions/Tweet";
import PostImage from "./extensions/PostImage";
import PollItem from "./extensions/PollItem";
import type { PollT } from "@/types";

const lowlight = createLowlight(common);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("python", python);

//eslint-disable-next-line
export function useLogic(props: RichEditor2Props, ref: ForwardedRef<RichEditor2T>) {
  const { value, className, placeholder, disableFeatures, onChange, onFocus, onBlur } = props;

  const imageDialogRef = useRef<ImageAddDialogT | null>(null);

  const [lastCursorIdx, setLastCursorIdx] = useState<null | number>(null);
  const [textSelectionEl, setTextSelectionEl] = useState<HTMLDivElement | null>(null);
  const [bubbleOpen, setBubbleOpen] = useState<boolean>(false);
  // const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false);
  const [imageDialogOpen, setImageDialogOpen] = useUrlState<boolean>({
    key: "imageOpen",
    query2val: (query) => query === "true",
    val2query: (val) => val ? "true" : null,
    backOn: (val) => !val,
  });
  // const [pollDialogOpen, setPollDialogOpen] = useState<boolean>(false);
  const [pollDialogOpen, setPollDialogOpen] = useUrlState<boolean>({
    key: "pollOpen",
    query2val: (query) => query === "true",
    val2query: (val) => val ? "true" : null,
    backOn: (val) => !val,
  });

  const { enqueueSnackbar } = useSnackbar();
  // const { showAlertDialog } = useAlertDialog();

  useImperativeHandle(ref, () => ({
    showImageDialog: (): void => {
      handleImageDialogOpen();
    },
    showPollDialog: (): void => {
      handlePollDialogOpen();
    },
    insertEmptyParagraph: (): void => {
      if (!editor) {
        return;
      }
      editor.commands.focus("end");
      editor.commands.createParagraphNear();
    },
    setHtml: (html: string): void => {
      if (!editor) {
        return;
      }
      editor.commands.setContent(html);
      const newHtml = editor.getHTML() ?? "";
      onChange(newHtml);
    },
    querySelectAll(selectors: keyof HTMLElementTagNameMap): null | NodeListOf<HTMLElement> {
      if (!editor) {
        return null;
      }
      return editor.view.dom.querySelectorAll(selectors);
    },
  }));

  // close dependent popup
  useEffect(() => {
    if (!bubbleOpen) {
      setTextSelectionEl(null);
    }
  }, [bubbleOpen]);

  const editor = useEditor({
    extensions: [
      // Increment,
      LinkPreview,
      Tweet,
      PostImage,
      PollItem,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Link.configure({
        linkOnPaste: false,
      }),
      Placeholder.configure({
        placeholder: () => {
          return placeholder ?? "내용을 적어주세요.";
        },
      }),
      Image,
      Youtube.configure({
        width: undefined,
        height: undefined,
        interfaceLanguage: "kr",
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const newVal = editor.getHTML();
      onChange(newVal);
      setBubbleOpen(false);
    },
  });

  editor?.setOptions({
    editorProps: {
      attributes: {
        class: className ?? "",
      },
      handleDrop: (editor, event) => {
        const files = event.dataTransfer?.files; // the dropped file
        if (!files) {
          return false;
        }
        const imgFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
        if (!imgFiles.length) {
          return false;
        }
        imageDialogRef.current?.addFiles(imgFiles);
        setImageDialogOpen(true);

        return true;
      },
      handlePaste: (view, event, slice) => {
        // if first content is link
        if (!disableFeatures?.includes("link")) {
          const firstText = slice.content.firstChild?.textContent;
          if (checkUrl(firstText ?? "")) {
            const url = firstText ?? "";
            if (isValidYoutubeUrl(url)) {
              // if (url.includes('/shorts/') && !url.includes('?feature=share')) {
              //   showSnackbar('error', '유튜브 쇼츠는 "공유" 버튼을 클릭해서 url 을 복사해주세요.');
              //   return true;
              // }
              return false;
            }
            editor?.commands.insertContent(`<link-preview url="${firstText}"></link-preview><p></p>`);
            return true;
          }
        }

        // check images
        const items = Array.from(event.clipboardData?.items || []);
        const imgFiles: File[] = [];
        for (const item of items) {
          if (item.type.indexOf("image") === 0) {
            const imgFile = item.getAsFile();
            if (imgFile) {
              imgFiles.push(imgFile);
            }
          }
        }
        if (imgFiles.length) {
          imageDialogRef.current?.addFiles(imgFiles);
          setImageDialogOpen(true);
          return true;
        } else {
          return false;
        }
      },
    },
  });

  // controlled behavior
  useEffect(() => {
    if (!editor) {
      return;
    }
    const content = editor.getHTML();
    // console.log("content:", content);
    // console.log("vaulue", value);
    if (content !== value) {
      try {
        editor.commands.setContent(value);
      } catch (e) {
        console.warn(e);
        editor.commands.setContent("");
        enqueueSnackbar("오류 발생으로 게시글을 로드할 수 없습니다.", { variant: "error" });
      }
    }
  }, [Boolean(editor), value]);

  function handleTextSelectionClick(e: MouseEvent<HTMLDivElement>): void {
    if (textSelectionEl) {
      setTextSelectionEl(null);
    } else {
      setTextSelectionEl(e.currentTarget);
    }
  }

  function handleTextSelectionClose(): void {
    setTextSelectionEl(null);
  }

  function handleCheckBubble(): void {
    if (!editor) {
      return;
    }
    const { from, to } = editor.view.state.selection;

    // check if image clicked
    const fragment = editor.view.state.selection.content();
    if (fragment.content.childCount == 1 && fragment.content.lastChild?.type.name == "image") {
      setBubbleOpen(false);
      return;
    }

    if (from == to) {
      const cursor = from;
      setLastCursorIdx(cursor);
      if (lastCursorIdx == cursor) {
        setBubbleOpen(!bubbleOpen);
      } else {
        setBubbleOpen(false);
      }
    } else {
      setLastCursorIdx(null);
      setBubbleOpen(true);
    }
  }

  function handleImageDialogOpen(): void {
    setBubbleOpen(false);
    setImageDialogOpen(true);
  }

  function handleImageDialogClose(): void {
    setImageDialogOpen(false);
  }

  async function handleImageDialogUploaded(
    imgMetas: {key: string, width?: number, height?:number}[],
  ): Promise<void> {

    if (!editor) {
      return;
    }

    const htmlContent = imgMetas.map((imgMeta) => {
      return `<post-image path="${imgMeta.key}" width="${imgMeta.width}" height="${imgMeta.height}"></post-image>`;
    }).join("");
    const cursor = editor.view.state.selection.to;
    editor.chain().focus().setTextSelection(cursor).run();
    editor.commands.insertContent(htmlContent);


    // for (const imgMeta of imgMetas) {
    //   const cursor = editor.view.state.selection.to;
    //   editor.chain().focus().setTextSelection(cursor).run();
    //   editor.commands.insertContent(
    //     `<post-image path="${imgMeta.key}" width="${imgMeta.width}" height="${imgMeta.height}"></post-image>`
    //   );
    //   editor
    //     .chain()
    //     .focus()
    //     .setTextSelection(cursor + 1)
    //     .run();
    //   editor.commands.createParagraphNear();
    // }

    setImageDialogOpen(false);
  }


  function handleBlur(e: FocusEvent<HTMLElement>): void {
    const preventKey = e.relatedTarget?.getAttribute("tabindex");
    if (preventKey === "0") {
      return;
    }
    setLastCursorIdx(null);
    setBubbleOpen(false);
    if (onBlur) {
      onBlur();
    }
  }

  function handlePollDialogOpen(): void {
    setBubbleOpen(false);
    setPollDialogOpen(true);
  }

  function handlePollDialogClose(): void {
    setPollDialogOpen(false);
  }

  function handlePollCreated(poll: PollT): void {
    if (!editor) {
      return;
    }
    const cursor = editor.view.state.selection.to;
    editor.chain().focus().setTextSelection(cursor).run();
    editor.commands.insertContent(`<poll-item id="${poll.id}"></poll-item><p></p>`);
    editor
      .chain()
      .focus()
      .setTextSelection(cursor + 1)
      .run();
    setPollDialogOpen(false);
  }

  return {
    imageDialogRef,
    editor,
    bubbleOpen,
    textSelectionEl,
    disableFeatures,
    imageDialogOpen,
    pollDialogOpen,
    handleTextSelectionClick,
    handleTextSelectionClose,
    handleImageDialogUploaded,
    handleImageDialogOpen,
    handleImageDialogClose,
    handleCheckBubble,
    onFocus,
    handleBlur,
    handlePollDialogOpen,
    handlePollDialogClose,
    handlePollCreated,
  };
}
