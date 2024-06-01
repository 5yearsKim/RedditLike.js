import React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownParserProps = {
  text: string;
};

export function MarkdownParserView(props: MarkdownParserProps): JSX.Element {
  return (
    <div>
      <ReactMarkdown>{props.text}</ReactMarkdown>
    </div>
  );
}
