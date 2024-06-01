import React from "react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { LinkPreview } from "@/ui/custom_nodes/LinkPreview";

function Component(props: NodeViewProps): JSX.Element {
  const url = props.node.attrs.url;
  return (
    <NodeViewWrapper>
      <LinkPreview url={url} />
    </NodeViewWrapper>
  );
}

export default Node.create({
  name: "linkPreview",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      url: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "link-preview",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["link-preview", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
