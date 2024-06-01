"use client";
import React from "react";
import htmlParse, { Element } from "html-react-parser";

import { HtmlParserProps, HtmlStyleProvider } from "./style";
import { LinkPreview } from "@/ui/custom_nodes/LinkPreview";
import { Tweet } from "@/ui/custom_nodes/Tweet";
import { PostImage } from "@/ui/custom_nodes/PostImage";
import { PollItem } from "@/ui/custom_nodes/PollItem";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";

import Lowlight from "react-lowlight";

Lowlight.registerLanguage("html", html);
Lowlight.registerLanguage("css", css);
Lowlight.registerLanguage("js", js);
Lowlight.registerLanguage("ts", ts);
Lowlight.registerLanguage("python", python);

export function HtmlParserView(props: HtmlParserProps): JSX.Element {
  const { html, className, fontSize, lineHeight } = props;

  // const cleanHtml = html;
  const parsed = htmlParse(html, {
    replace: (node: any) => {
      if (node instanceof Element && node.name == "code") {
        const codeText = (node.children[0] as any).data;
        return (
          <Lowlight
            value={codeText}
            inline
          />
        );
      }
      if (node instanceof Element && node.name == "link-preview") {
        return <LinkPreview url={node.attribs.url} />;
      }
      if (node instanceof Element && node.name == "tweet") {
        return <Tweet id={node.attribs.id} />;
      }
      if (node instanceof Element && node.name == "post-image") {
        const attr = node.attribs;
        const parseIntNullable = (val: any) => {
          const parsed = parseInt(val);
          return isNaN(parsed) ? undefined : parsed;
        };
        return (
          <PostImage
            path={attr.path}
            alt={attr.alt}
            width={parseIntNullable(attr.width)}
            height={parseIntNullable(attr.height)}
          />
        );
      }
      if (node instanceof Element && node.name == "poll-item") {
        const attr = node.attribs;
        return (
          <PollItem
            pollId={parseInt(attr.id)}
          />
        );
      }
      return undefined;
    },
  });

  return (
    <div
      className={`nuco-html ${className}`}
      style={{ padding: 0, overflow: "hidden" }}
    >
      <HtmlStyleProvider
        fontSize={fontSize}
        lineHeight={lineHeight}
      >
        {parsed}
      </HtmlStyleProvider>
    </div>
  );
}
