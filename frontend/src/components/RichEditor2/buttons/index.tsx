import React from "react";
import { useTranslations } from "next-intl";
import {
  FormatBoldIcon,
  FormatItalicIcon,
  FormatUnderlinedIcon,
  FormatStrikeIcon,
  FormatQuoteIcon,
  FormatListButlletIcon,
  FormatListNumberIcon,
  CodeBlockIcon,
  TextIcon,
} from "@/ui/icons";
import type { ButtonProps } from "./type";
import { IB, TB } from "./style";

export { AlignIB } from "./AlignIB";
export { ImageIB } from "./ImageIB";
export { LinkIB } from "./LinkIB";
export { LinkAddIB } from "./LinkAddIB";
export { YoutubeIB } from "./YoutubeIB";
export { TweetIB } from "./TweetIB";
export { PollIB } from "./PollIB";

export function BoldIB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  return (
    <IB
      icon={<FormatBoldIcon />}
      onClick={(): boolean => editor.chain().focus().toggleBold().run()}
      selected={editor.isActive("bold")}
    />
  );
}

export function StrikeIB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  return (
    <IB
      icon={<FormatStrikeIcon />}
      onClick={(): boolean => editor.chain().focus().toggleStrike().run()}
      selected={editor.isActive("strike")}
    />
  );
}

export function UnderlineIB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  return (
    <IB
      icon={<FormatUnderlinedIcon />}
      onClick={(): boolean => editor.chain().focus().toggleUnderline().run()}
      selected={editor.isActive("underline")}
    />
  );
}

export function BlockQuoteIB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  return (
    <IB
      icon={<FormatQuoteIcon />}
      onClick={(): boolean => editor.chain().focus().toggleBlockquote().run()}
      selected={editor.isActive("blockQuote")}
    />
  );
}

export function ItalicIB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  return (
    <IB
      icon={<FormatItalicIcon />}
      onClick={(): boolean => editor.chain().focus().toggleItalic().run()}
      selected={editor.isActive("italic")}
    />
  );
}

export function TextTB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  const t = useTranslations("components.RichEditor2");

  return (
    <TB
      icon={<TextIcon />}
      label={t("text")}
      selected={editor.isActive("text")}
      onClick={(): boolean => editor.chain().focus().clearNodes().run()}
    />
  );
}

interface HeadingButtonProps extends ButtonProps {
  level: number;
}

export function HeadingTB(props: HeadingButtonProps): JSX.Element {
  const { editor, level } = props;
  const t = useTranslations("components.RichEditor2");

  return (
    <TB
      icon={<span style={{ fontSize: 14, fontWeight: 700 }}>H{level}</span>}
      label={`${t("heading")}${level}`}
      selected={editor.isActive("heading", { level: level })}
      onClick={(): boolean =>
        editor
          .chain()
          .focus()
          .toggleHeading({ level: level as any })
          .run()
      }
    />
  );
}

export function BulletListTB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  const t = useTranslations("components.RichEditor2");

  return (
    <TB
      icon={<FormatListButlletIcon />}
      label={t("list")}
      selected={editor.isActive("bulletList")}
      onClick={(): boolean => editor.chain().focus().toggleBulletList().run()}
    />
  );
}

export function OrderedListTB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  const t = useTranslations("components.RichEditor2");

  return (
    <TB
      icon={<FormatListNumberIcon />}
      label={t("numList")}
      selected={editor.isActive("orderedList")}
      onClick={(): boolean => editor.chain().focus().toggleOrderedList().run()}
    />
  );
}

export function CodeBlockTB(props: ButtonProps): JSX.Element {
  const { editor } = props;
  const t = useTranslations("components.RichEditor2");

  return (
    <TB
      icon={<CodeBlockIcon />}
      label={t("code")}
      selected={editor.isActive("codeBlock")}
      onClick={(): boolean => editor.chain().focus().toggleCodeBlock().run()}
    />
  );
}
